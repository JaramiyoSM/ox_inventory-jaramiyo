import React, { useEffect, useState } from 'react';
import { Locale } from '../../../store/locale';
import { sfx } from '../../../utils/sfx';

const SWATCHES = [
  '#d9738f', '#e0607f', '#c0567a', '#a392c0', '#8f7fc0', '#e08b5a', '#d8a23c', '#7fb37a',
  '#5aa0b0', '#c05a5a', '#b0607f', '#edb2c2', '#f6c9d6', '#9a7480', '#7a5a6a', '#5a3f4c',
];
const DEFAULT_ACCENT = '#d9738f';

export const applySavedAccent = () => {
  try {
    const saved = localStorage.getItem('jrmy-accent');
    if (saved) document.documentElement.style.setProperty('--jaccent', saved);
  } catch {
    /* ignore */
  }
};

const CONTROLS: { keys: string[]; desc: string }[] = [
  { keys: ['RMB'], desc: Locale.ui_rmb || 'Abrir el menú de acciones' },
  { keys: ['ALT', 'LMB'], desc: Locale.ui_alt_lmb || 'Usar el objeto' },
  { keys: ['CTRL', 'LMB'], desc: Locale.ui_ctrl_lmb || 'Transferir rápido' },
  { keys: ['SHIFT', 'Drag'], desc: Locale.ui_shift_drag || 'Dividir la pila' },
  { keys: ['CTRL', 'SHIFT', 'LMB'], desc: Locale.ui_ctrl_shift_lmb || 'Transferir la pila entera' },
];

const SettingsTab: React.FC = () => {
  const [accent, setAccent] = useState<string>(() => {
    try {
      return localStorage.getItem('jrmy-accent') || DEFAULT_ACCENT;
    } catch {
      return DEFAULT_ACCENT;
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--jaccent', accent);
  }, [accent]);

  const pick = (c: string) => {
    sfx.click();
    setAccent(c);
    try {
      localStorage.setItem('jrmy-accent', c);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="jinv-tab-settings">
      <div className="jinv-sec">{Locale.jrmy_controls || 'Controles'}</div>
      {CONTROLS.map((c, i) => (
        <div className="jinv-ctrl" key={i}>
          <div className="jinv-ctrl-keys">
            {c.keys.map((k) => (
              <span className="jinv-kbd" key={k}>{k}</span>
            ))}
          </div>
          <div className="jinv-ctrl-desc">{c.desc}</div>
        </div>
      ))}

      <div className="jinv-sec">{Locale.jrmy_maincolor || 'Color principal'}</div>
      <div className="jinv-swatches">
        {SWATCHES.map((c) => (
          <div
            className={c === accent ? 'jinv-sw sel' : 'jinv-sw'}
            style={{ background: c }}
            key={c}
            onClick={() => pick(c)}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsTab;
