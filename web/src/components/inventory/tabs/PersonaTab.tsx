import React, { useState } from 'react';
import { fetchNui } from '../../../utils/fetchNui';
import { Locale } from '../../../store/locale';
import { sfx } from '../../../utils/sfx';
import MultiJobPanel from '../MultiJobPanel';

import mask from '../../../assets/ropa/mask.png';
import hat from '../../../assets/ropa/hat.png';
import glasses from '../../../assets/ropa/glasses.png';
import neck from '../../../assets/ropa/neck.png';
import top from '../../../assets/ropa/top.png';
import vest from '../../../assets/ropa/vest.png';
import torso from '../../../assets/ropa/torso.png';
import backpack from '../../../assets/ropa/backpack.png';
import watch from '../../../assets/ropa/watch.png';
import gloves from '../../../assets/ropa/gloves.png';
import pants from '../../../assets/ropa/pants.png';
import shoes from '../../../assets/ropa/shoes.png';
import editorImg from '../../../assets/ropa/editor.webp';

// each clothing slot toggles a ped component/prop server-side (native, handled in Lua)
const CLOTH: { piece: string; icon: string; label: string }[] = [
  { piece: 'mask', icon: mask, label: 'Mask' },
  { piece: 'hat', icon: hat, label: 'Hat' },
  { piece: 'glasses', icon: glasses, label: 'Glasses' },
  { piece: 'neck', icon: neck, label: 'Scarf' },
  { piece: 'top', icon: top, label: 'Top' },
  { piece: 'vest', icon: vest, label: 'Vest' },
  { piece: 'torso', icon: torso, label: 'Torso' },
  { piece: 'bag', icon: backpack, label: 'Backpack' },
  { piece: 'watch', icon: watch, label: 'Watch' },
  { piece: 'gloves', icon: gloves, label: 'Gloves' },
  { piece: 'pants', icon: pants, label: 'Pants' },
  { piece: 'shoes', icon: shoes, label: 'Shoes' },
];

const PersonaTab: React.FC = () => {
  const [mjOpen, setMjOpen] = useState(false);

  const toggleClothing = (piece: string) => {
    sfx.click();
    fetchNui('jrmyToggleClothing', { piece });
  };
  const toggleHair = () => {
    sfx.use();
    fetchNui('jrmyToggleHair');
  };
  const openEditor = () => {
    sfx.click();
    fetchNui('jrmyOpenEditor');
  };

  return (
    <div className="jinv-tab-person">
      <div className="jinv-sec">{Locale.jrmy_clothing || 'Clothing'}</div>
      <div className="jinv-cloth">
        {CLOTH.map((c) => (
          <div className="jinv-cslot" key={c.piece} onClick={() => toggleClothing(c.piece)} onMouseEnter={() => sfx.hover()}>
            <span className="jinv-cico" style={{ ['--src' as any]: `url(${c.icon})` }} />
            <span>{Locale['jrmy_' + c.piece] || c.label}</span>
          </div>
        ))}
      </div>

      <div className="jinv-sec">{Locale.jrmy_actions || 'Actions'}</div>
      <div className="jinv-actions">
        <button className="jinv-act" onClick={() => { sfx.click(); setMjOpen(true); }} onMouseEnter={() => sfx.hover()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          <span>{Locale.jrmy_multijob || 'Multi Job'}</span>
        </button>
        <button className="jinv-act" onClick={toggleHair} onMouseEnter={() => sfx.hover()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" /></svg>
          <span>{Locale.jrmy_togglehair || 'Toggle hair'}</span>
        </button>
      </div>

      <button className="jinv-editor" onClick={openEditor} onMouseEnter={() => sfx.hover()} aria-label={Locale.jrmy_editor || 'Rockstar Editor'}>
        <img src={editorImg} alt={Locale.jrmy_editor || 'Rockstar Editor'} />
      </button>

      <MultiJobPanel open={mjOpen} onClose={() => setMjOpen(false)} />
    </div>
  );
};

export default PersonaTab;
