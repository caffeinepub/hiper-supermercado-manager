import { GameAssets } from './assetLoader';
import { SECTOR_LAYOUT } from '../data/sectorLayout';
import { getSectorDefinition } from '../../features/sectors/sectorConstants';

export function drawSectors(
  ctx: CanvasRenderingContext2D,
  assets: GameAssets,
  scale: number,
  offsetX: number,
  offsetY: number,
  selectedSector: string | null
): void {
  const cellSize = 50;
  
  SECTOR_LAYOUT.forEach(sector => {
    const sectorDef = getSectorDefinition(sector.name);
    if (!sectorDef) return;
    
    const x = offsetX + sector.x * cellSize * scale;
    const y = offsetY + sector.y * cellSize * scale;
    const width = sector.width * cellSize * scale;
    const height = sector.height * cellSize * scale;
    
    // Draw sector background with color
    ctx.fillStyle = sectorDef.color + '20'; // 20 = 12.5% opacity
    ctx.fillRect(x, y, width, height);
    
    // Draw sector border
    ctx.strokeStyle = sectorDef.color;
    ctx.lineWidth = selectedSector === sector.name ? 3 : 1.5;
    ctx.strokeRect(x, y, width, height);
    
    // Highlight selected sector
    if (selectedSector === sector.name) {
      ctx.fillStyle = sectorDef.color + '40'; // 40 = 25% opacity
      ctx.fillRect(x, y, width, height);
    }
    
    // Draw fixture representation based on type
    drawFixture(ctx, assets, sector.fixtureType, x, y, width, height, scale);
    
    // Draw sector icon (emoji)
    const iconSize = Math.max(16, 24 * scale);
    ctx.font = `${iconSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sectorDef.icon, x + width / 2, y + height / 3);
    
    // Draw sector name
    const fontSize = Math.max(8, 11 * scale);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.fillText(sector.name, x + width / 2, y + height * 0.65);
  });
}

function drawFixture(
  ctx: CanvasRenderingContext2D,
  assets: GameAssets,
  fixtureType: 'shelf' | 'counter' | 'refrigerator',
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number
): void {
  ctx.save();
  
  // Draw simplified fixture representation
  const padding = 5 * scale;
  const fixtureX = x + padding;
  const fixtureY = y + height * 0.7;
  const fixtureWidth = width - padding * 2;
  const fixtureHeight = height * 0.25;
  
  switch (fixtureType) {
    case 'shelf':
      // Draw shelves as horizontal lines
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const shelfY = fixtureY + (fixtureHeight / 3) * i;
        ctx.beginPath();
        ctx.moveTo(fixtureX, shelfY);
        ctx.lineTo(fixtureX + fixtureWidth, shelfY);
        ctx.stroke();
      }
      break;
      
    case 'counter':
      // Draw counter as solid rectangle
      ctx.fillStyle = '#555';
      ctx.fillRect(fixtureX, fixtureY, fixtureWidth, fixtureHeight);
      ctx.strokeStyle = '#777';
      ctx.lineWidth = 1;
      ctx.strokeRect(fixtureX, fixtureY, fixtureWidth, fixtureHeight);
      break;
      
    case 'refrigerator':
      // Draw refrigerator as rectangle with vertical lines
      ctx.fillStyle = '#334155';
      ctx.fillRect(fixtureX, fixtureY, fixtureWidth, fixtureHeight);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      // Vertical dividers
      for (let i = 1; i < 4; i++) {
        const dividerX = fixtureX + (fixtureWidth / 4) * i;
        ctx.beginPath();
        ctx.moveTo(dividerX, fixtureY);
        ctx.lineTo(dividerX, fixtureY + fixtureHeight);
        ctx.stroke();
      }
      break;
  }
  
  ctx.restore();
}
