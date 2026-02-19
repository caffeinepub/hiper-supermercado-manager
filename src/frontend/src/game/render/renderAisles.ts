import { GameAssets } from './assetLoader';

export function drawAisles(
  ctx: CanvasRenderingContext2D,
  assets: GameAssets,
  storeWidth: number,
  storeHeight: number,
  scale: number,
  offsetX: number,
  offsetY: number
): void {
  const cellSize = 50;
  
  // Draw floor tiles across entire store
  ctx.save();
  
  // Create pattern from floor tileset
  const pattern = ctx.createPattern(assets.floor, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(offsetX, offsetY, storeWidth * scale, storeHeight * scale);
  } else {
    // Fallback to solid color
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(offsetX, offsetY, storeWidth * scale, storeHeight * scale);
  }
  
  // Draw aisle lines (vertical corridors between sectors)
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  
  // Vertical aisles every 3 cells
  for (let x = 3; x <= 9; x += 3) {
    const aisleX = offsetX + x * cellSize * scale;
    ctx.beginPath();
    ctx.moveTo(aisleX, offsetY);
    ctx.lineTo(aisleX, offsetY + storeHeight * scale);
    ctx.stroke();
  }
  
  // Horizontal aisles every 2 cells
  for (let y = 2; y <= 6; y += 2) {
    const aisleY = offsetY + y * cellSize * scale;
    ctx.beginPath();
    ctx.moveTo(offsetX, aisleY);
    ctx.lineTo(offsetX + storeWidth * scale, aisleY);
    ctx.stroke();
  }
  
  ctx.restore();
}
