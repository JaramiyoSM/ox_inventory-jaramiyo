import React, { useCallback, useEffect, useState } from 'react';
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

const MultiJobPanel: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [mj, setMj] = useState<MultijobData>({ active: '', jobs: [], max: 3 });

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchNui<MultijobData>('jrmyMultijobGet');
    setMj(data || { active: '', jobs: [], max: 3 });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  if (!open) return null;

  const switchJob = async (job: MultijobJob) => {
    if (job.name === mj.active) return;
    sfx.click();
    const ok = await fetchNui<number>('jrmyMultijobSwitch', { job: job.name });
    ok ? await load() : sfx.error();
  };
  const leaveJob = async (job: MultijobJob) => {
    sfx.drop();
    const ok = await fetchNui<number>('jrmyMultijobLeave', { job: job.name });
    ok ? await load() : sfx.error();
  };

  return (
    <div className="jinv-mj-overlay" onClick={onClose}>
      <div className="jinv-mj-panel" onClick={(e) => e.stopPropagation()}>
        <div className="jinv-mj-head">
          <span className="jinv-mj-title">✿ {Locale.jrmy_multijob || 'Multi Job'}</span>
          <div className="jinv-mj-close" onClick={onClose} aria-label="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </div>
        </div>
        <div className="jinv-mj-body">
          {loading ? (
            <div className="jinv-mj-empty">…</div>
          ) : mj.jobs.length === 0 ? (
            <div className="jinv-mj-empty">{Locale.jrmy_nojobs || 'Sin trabajos'}</div>
          ) : (
            mj.jobs.map((job) => {
              const active = job.name === mj.active;
              return (
                <div key={job.name} className={active ? 'jinv-mj-slot is-active' : 'jinv-mj-slot'}>
                  <div className="jinv-mj-slot-info">
                    <span className="jinv-mj-slot-label">{job.label || job.name}</span>
                    {job.gradeLabel && <span className="jinv-mj-slot-grade">{job.gradeLabel}</span>}
                  </div>
                  {active ? (
                    <span className="jinv-mj-badge">{Locale.jrmy_active || 'Activo'}</span>
                  ) : (
                    <div className="jinv-mj-slot-actions">
                      <button className="jinv-mj-cta" onClick={() => switchJob(job)}>{Locale.jrmy_switch || 'Cambiar'}</button>
                      <button className="jinv-mj-leave" onClick={() => leaveJob(job)} aria-label="leave">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="jinv-mj-foot">{mj.jobs.length} / {mj.max}</div>
      </div>
    </div>
  );
};

export default MultiJobPanel;
