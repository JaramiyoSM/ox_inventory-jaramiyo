import React from 'react';
import LeftInventory from '../LeftInventory';
import RightInventory from '../RightInventory';
import ControlBar from '../ControlBar';

const InventoryTab: React.FC = () => (
  <div className="jinv-tab-inventory">
    <LeftInventory />
    <RightInventory />
    <ControlBar />
  </div>
);

export default InventoryTab;
