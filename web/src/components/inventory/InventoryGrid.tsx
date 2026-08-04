import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight, isSlotWithItem } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  // Search only dims non-matching items — it never removes or re-orders slots,
  // so item positions and drag-and-drop stay exactly the same.
  const query = search.trim().toLowerCase();
  const itemLabel = (item: Inventory['items'][number]) =>
    (item.metadata?.label || (item.name && Items[item.name]?.label) || item.name || '').toString().toLowerCase();

  const itemsToRender = query ? inventory.items : inventory.items.slice(0, (page + 1) * PAGE_SIZE);

  return (
    <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div className="inventory-grid-header-wrapper">
        <div className="inventory-header-left">
          <div className="inventory-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <p className="inventory-header-label">{inventory.label}</p>
        </div>
        {inventory.maxWeight !== undefined && (
          <p className="inventory-header-weight">
            {(weight / 1000).toLocaleString('en-us', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} /{' '}
            {(inventory.maxWeight / 1000).toLocaleString('en-us', { maximumFractionDigits: 1 })} kg
          </p>
        )}
      </div>

      <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />

      <div className={search ? 'inventory-search inventory-search-active' : 'inventory-search'}>
        <div className="inventory-search-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          className="inventory-search-input"
          placeholder={Locale.ui_search || 'Buscar...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          spellCheck={false}
        />
        {search && (
          <div className="inventory-search-clear" onClick={() => setSearch('')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>

      <div className="inventory-grid-container" ref={containerRef}>
        <>
          {itemsToRender.map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={!query && index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
              dimmed={!!query && isSlotWithItem(item) && !itemLabel(item).includes(query)}
            />
          ))}
        </>
      </div>
    </div>
  );
};

export default InventoryGrid;
