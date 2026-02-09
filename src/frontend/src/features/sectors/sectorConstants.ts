export interface SectorDefinition {
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const SECTOR_DEFINITIONS: SectorDefinition[] = [
  { name: 'Produce', icon: '🥬', color: '#22c55e', description: 'Fresh fruits and vegetables' },
  { name: 'Butcher', icon: '🥩', color: '#ef4444', description: 'Fresh meat and poultry' },
  { name: 'Fish', icon: '🐟', color: '#3b82f6', description: 'Fresh seafood' },
  { name: 'Bakery', icon: '🍞', color: '#f59e0b', description: 'Fresh baked goods' },
  { name: 'Dairy', icon: '🧀', color: '#fbbf24', description: 'Dairy products and cheese' },
  { name: 'Grocery', icon: '🛒', color: '#8b5cf6', description: 'Packaged foods and staples' },
  { name: 'Drinks', icon: '🥤', color: '#06b6d4', description: 'Beverages and soft drinks' },
  { name: 'Frozen', icon: '❄️', color: '#0ea5e9', description: 'Frozen foods' },
  { name: 'Cleaning', icon: '🧹', color: '#10b981', description: 'Cleaning products' },
  { name: 'Hygiene', icon: '🧴', color: '#ec4899', description: 'Personal care products' },
  { name: 'Pet', icon: '🐕', color: '#f97316', description: 'Pet food and supplies' },
  { name: 'Electronics', icon: '📱', color: '#6366f1', description: 'Electronics and gadgets' },
  { name: 'HomeGoods', icon: '🏠', color: '#84cc16', description: 'Home utilities and goods' },
  { name: 'Bazaar', icon: '🎁', color: '#a855f7', description: 'General merchandise' },
  { name: 'Pharmacy', icon: '💊', color: '#14b8a6', description: 'Health and wellness' },
  { name: 'Organics', icon: '🌱', color: '#65a30d', description: 'Organic products' },
  { name: 'Wholesale', icon: '📦', color: '#78716c', description: 'Bulk purchases' },
];

export function getSectorDefinition(name: string): SectorDefinition | undefined {
  return SECTOR_DEFINITIONS.find(s => s.name === name);
}
