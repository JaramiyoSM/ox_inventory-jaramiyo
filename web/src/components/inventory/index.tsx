import React, { useEffect, useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import InventoryHotbar from './InventoryHotbar';
import { sfx } from '../../utils/sfx';
import TabBar, { InvTab } from './TabBar';
import InventoryTab from './tabs/InventoryTab';
import PersonaTab from './tabs/PersonaTab';
import SettingsTab, { applySavedAccent } from './tabs/SettingsTab';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [tab, setTab] = useState<InvTab>('inv');
  const dispatch = useAppDispatch();

  useEffect(() => {
    applySavedAccent();
  }, []);

  useNuiEvent<boolean>('setInventoryVisible', (visible) => {
    setInventoryVisible(visible);
    visible ? sfx.open() : sfx.close();
    if (visible) setTab('inv');
  });
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
    sfx.close();
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{ leftInventory?: InventoryProps; rightInventory?: InventoryProps }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="jinv-stage">
          <div className="jinv-panel">
            <TabBar tab={tab} setTab={setTab} />
            <div className="jinv-content">
              {tab === 'inv' && <InventoryTab />}
              {tab === 'person' && <PersonaTab />}
              {tab === 'settings' && <SettingsTab />}
            </div>
          </div>
          <Tooltip />
          <InventoryContext />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
