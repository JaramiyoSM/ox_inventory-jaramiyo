import React, { useCallback, useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { sfx } from '../../utils/sfx';

interface MultijobJob {
  name: string;
  label?: string;
  grade?: number;
  gradeLabel?: string;
}

interface MultijobData {
  active: string;
  jobs: MultijobJob[];
  max: number;
}

const ActionsMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mjOpen, setMjOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mj, setMj] = useState<MultijobData>({ active: '', jobs: [], max: 3 });

  const loadMultijob = useCallback(async () => {
    setLoading(true);
    const data = await fetchNui<MultijobData>('jrmyMultijobGet');
    setMj(data || { active: '', jobs: [], max: 3 });
    setLoading(false);
  }, []);

  const openMultijob = async () => {
    sfx.click();
    setMenuOpen(false);
    setMjOpen(true);
    await loadMultijob();
  };

  const toggleHair = () => {
    sfx.use();
    setMenuOpen(false);
    fetchNui('jrmyToggleHair');
  };

  const switchJob = async (job: MultijobJob) => {
    if (job.name === mj.active) return;
    sfx.click();
    const ok = await fetchNui<number>('jrmyMultijobSwitch', { job: job.name });
    ok ? await loadMultijob() : sfx.error();
  };

  const leaveJob = async (job: MultijobJob) => {
    sfx.drop();
    const ok = await fetchNui<number>('jrmyMultijobLeave', { job: job.name });
    ok ? await loadMultijob() : sfx.error();
  };

  return (
    <>
      <button
        className={menuOpen ? 'jrmy-actions-fab is-open' : 'jrmy-actions-fab'}
        onClick={() => {
          sfx.click();
          setMenuOpen((v) => !v);
        }}
        aria-label="actions"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </button>

      {menuOpen && (
        <div className="jrmy-actions-menu">
          <button className="jrmy-actions-item" onClick={openMultijob}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>{Locale.jrmy_multijob || 'Multi Job'}</span>
          </button>
          <button className="jrmy-actions-item" onClick={toggleHair}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
            </svg>
            <span>{Locale.jrmy_togglehair || 'Toggle hair'}</span>
          </button>
        </div>
      )}

      {mjOpen && (
        <div className="jrmy-mj-overlay" onClick={() => setMjOpen(false)}>
          <div className="jrmy-mj-panel" onClick={(e) => e.stopPropagation()}>
            <div className="jrmy-mj-head">
              <span className="jrmy-mj-title">✿ {Locale.jrmy_multijob || 'Multi Job'}</span>
              <div className="jrmy-mj-close" onClick={() => setMjOpen(false)} aria-label="close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </div>
            </div>

            <div className="jrmy-mj-body">
              {loading ? (
                <div className="jrmy-mj-empty">…</div>
              ) : mj.jobs.length === 0 ? (
                <div className="jrmy-mj-empty">{Locale.jrmy_nojobs || 'No jobs yet'}</div>
              ) : (
                mj.jobs.map((job) => {
                  const active = job.name === mj.active;
                  return (
                    <div key={job.name} className={active ? 'jrmy-mj-slot is-active' : 'jrmy-mj-slot'}>
                      <div className="jrmy-mj-slot-info">
                        <span className="jrmy-mj-slot-label">{job.label || job.name}</span>
                        {job.gradeLabel && <span className="jrmy-mj-slot-grade">{job.gradeLabel}</span>}
                      </div>
                      {active ? (
                        <span className="jrmy-mj-badge">{Locale.jrmy_active || 'Active'}</span>
                      ) : (
                        <div className="jrmy-mj-slot-actions">
                          <button className="jrmy-mj-cta" onClick={() => switchJob(job)}>
                            {Locale.jrmy_switch || 'Switch'}
                          </button>
                          <button className="jrmy-mj-leave" onClick={() => leaveJob(job)} aria-label="leave">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="jrmy-mj-foot">
              {mj.jobs.length} / {mj.max}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionsMenu;
