import React from 'react';
import { sfx } from '../../utils/sfx';

export type InvTab = 'inv' | 'person' | 'settings';

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </svg>
);
const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TABS: { id: InvTab; Icon: React.FC; label: string }[] = [
  { id: 'inv', Icon: GridIcon, label: 'inventory' },
  { id: 'person', Icon: PersonIcon, label: 'appearance' },
  { id: 'settings', Icon: GearIcon, label: 'settings' },
];

const TabBar: React.FC<{ tab: InvTab; setTab: (t: InvTab) => void }> = ({ tab, setTab }) => {
  const pick = (t: InvTab) => {
    if (t === tab) return;
    sfx.click();
    setTab(t);
  };

  return (
    <div className="jinv-tabbar">
      {TABS.map(({ id, Icon, label }) => (
        <button
          key={id}
          className={tab === id ? 'jinv-tab active' : 'jinv-tab'}
          onClick={() => pick(id)}
          onMouseEnter={() => sfx.hover()}
          aria-label={label}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
};

export default TabBar;
