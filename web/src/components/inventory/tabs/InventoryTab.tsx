import React from 'react';
import LeftInventory from '../LeftInventory';
import RightInventory from '../RightInventory';
import { useAppSelector } from '../../../store';
import { selectRightInventory } from '../../../store/inventory';

const InventoryTab: React.FC = () => {
  const right = useAppSelector(selectRightInventory);
  // only show the second inventory when a real container is open — not the
  // empty ground drop ('newdrop') that ox_inventory always provides.
  const showRight = right.type !== '' && right.type !== 'newdrop';

  return (
    <div className="jinv-tab-inventory">
      <LeftInventory />
      {showRight && <RightInventory />}
    </div>
  );
};

export default InventoryTab;
