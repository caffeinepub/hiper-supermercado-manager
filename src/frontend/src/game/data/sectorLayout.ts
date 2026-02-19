import { SECTOR_DEFINITIONS } from '../../features/sectors/sectorConstants';

export interface SectorLayoutPosition {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fixtureType: 'shelf' | 'counter' | 'refrigerator';
}

// Define a logical supermarket layout with all 17 sectors
// Grid is 12x8 cells (600x400 pixels, 50px per cell)
export const SECTOR_LAYOUT: SectorLayoutPosition[] = [
  // Front left - Produce (near entrance)
  { name: 'Produce', x: 0, y: 0, width: 3, height: 2, fixtureType: 'counter' },
  
  // Front center - Bakery
  { name: 'Bakery', x: 3, y: 0, width: 3, height: 2, fixtureType: 'counter' },
  
  // Front right - Organics
  { name: 'Organics', x: 6, y: 0, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Right side - Pharmacy
  { name: 'Pharmacy', x: 9, y: 0, width: 3, height: 2, fixtureType: 'counter' },
  
  // Second row left - Butcher
  { name: 'Butcher', x: 0, y: 2, width: 3, height: 2, fixtureType: 'counter' },
  
  // Second row center-left - Fish
  { name: 'Fish', x: 3, y: 2, width: 3, height: 2, fixtureType: 'counter' },
  
  // Second row center-right - Grocery
  { name: 'Grocery', x: 6, y: 2, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Second row right - Drinks
  { name: 'Drinks', x: 9, y: 2, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Third row left - Dairy
  { name: 'Dairy', x: 0, y: 4, width: 3, height: 2, fixtureType: 'refrigerator' },
  
  // Third row center-left - Frozen
  { name: 'Frozen', x: 3, y: 4, width: 3, height: 2, fixtureType: 'refrigerator' },
  
  // Third row center-right - Cleaning
  { name: 'Cleaning', x: 6, y: 4, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Third row right - Hygiene
  { name: 'Hygiene', x: 9, y: 4, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Back row left - Pet
  { name: 'Pet', x: 0, y: 6, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Back row center-left - Electronics
  { name: 'Electronics', x: 3, y: 6, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Back row center-right - HomeGoods
  { name: 'HomeGoods', x: 6, y: 6, width: 3, height: 2, fixtureType: 'shelf' },
  
  // Back row right - Bazaar
  { name: 'Bazaar', x: 9, y: 6, width: 2, height: 2, fixtureType: 'shelf' },
  
  // Back corner - Wholesale
  { name: 'Wholesale', x: 11, y: 6, width: 1, height: 2, fixtureType: 'shelf' },
];

export function getSectorLayout(sectorName: string): SectorLayoutPosition | undefined {
  return SECTOR_LAYOUT.find(s => s.name === sectorName);
}

export function getSectorAtPosition(x: number, y: number, scale: number, offsetX: number, offsetY: number): string | null {
  const cellSize = 50;
  
  for (const sector of SECTOR_LAYOUT) {
    const sectorX = offsetX + sector.x * cellSize * scale;
    const sectorY = offsetY + sector.y * cellSize * scale;
    const sectorWidth = sector.width * cellSize * scale;
    const sectorHeight = sector.height * cellSize * scale;
    
    if (x >= sectorX && x <= sectorX + sectorWidth &&
        y >= sectorY && y <= sectorY + sectorHeight) {
      return sector.name;
    }
  }
  
  return null;
}
