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
  } catch {}
};

const CONTROLS: { keys: string[]; key: string; fallback: string }[] = [
  { keys: ['RMB'], key: 'ui_rmb', fallback: 'Open the actions menu' },
  { keys: ['ALT', 'LMB'], key: 'ui_alt_lmb', fallback: 'Use the item' },
  { keys: ['CTRL', 'LMB'], key: 'ui_ctrl_lmb', fallback: 'Quick transfer' },
  { keys: ['SHIFT', 'Drag'], key: 'ui_shift_drag', fallback: 'Split the stack' },
  { keys: ['CTRL', 'SHIFT', 'LMB'], key: 'ui_ctrl_shift_lmb', fallback: 'Transfer the whole stack' },
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
    } catch {}
  };

  return (
    <div className="jinv-tab-settings">
      <div className="jinv-sec">{Locale.jrmy_controls || 'Controls'}</div>
      {CONTROLS.map((c, i) => (
        <div className="jinv-ctrl" key={i}>
          <div className="jinv-ctrl-keys">
            {c.keys.map((k) => (
              <span className="jinv-kbd" key={k}>{k}</span>
            ))}
          </div>
          <div className="jinv-ctrl-desc">{Locale[c.key] || c.fallback}</div>
        </div>
      ))}

      <div className="jinv-sec">{Locale.jrmy_maincolor || 'Main colour'}</div>
      <div className="jinv-swatches">
        {SWATCHES.map((c) => (
          <div
            className={c === accent ? 'jinv-sw sel' : 'jinv-sw'}
            style={{ background: c }}
            key={c}
            onClick={() => pick(c)}
            onMouseEnter={() => sfx.hover()}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsTab;
