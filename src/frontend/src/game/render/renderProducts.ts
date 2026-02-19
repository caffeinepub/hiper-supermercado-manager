import { GameAssets } from './assetLoader';
import { SECTOR_LAYOUT, getSectorLayout } from '../data/sectorLayout';
import { Product } from '../../hooks/useQueries';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

export function drawProducts(
  ctx: CanvasRenderingContext2D,
  assets: GameAssets,
  products: Product[],
  scale: number,
  offsetX: number,
  offsetY: number
): void {
  const cellSize = 50;
  
  // Use initial products as fallback if backend returns empty
  const productsToRender = products.length > 0 ? products : INITIAL_PRODUCTS.map(p => ({
    id: p.productId,
    name: p.name,
    baseCost: p.baseCost,
    sellPrice: p.sellPrice,
    sector: p.sector,
    shelfLife: p.shelfLife,
  }));
  
  // Group products by sector
  const productsBySector = new Map<string, Product[]>();
  productsToRender.forEach(product => {
    const existing = productsBySector.get(product.sector) || [];
    existing.push(product);
    productsBySector.set(product.sector, existing);
  });
  
  // Draw products within their sectors
  productsBySector.forEach((sectorProducts, sectorName) => {
    const sectorLayout = getSectorLayout(sectorName);
    if (!sectorLayout) return;
    
    const sectorX = offsetX + sectorLayout.x * cellSize * scale;
    const sectorY = offsetY + sectorLayout.y * cellSize * scale;
    const sectorWidth = sectorLayout.width * cellSize * scale;
    const sectorHeight = sectorLayout.height * cellSize * scale;
    
    // Distribute products across the sector
    const productsPerRow = Math.ceil(Math.sqrt(sectorProducts.length));
    const productWidth = sectorWidth / productsPerRow;
    const productHeight = sectorHeight * 0.3 / Math.ceil(sectorProducts.length / productsPerRow);
    
    sectorProducts.forEach((product, index) => {
      const row = Math.floor(index / productsPerRow);
      const col = index % productsPerRow;
      
      const px = sectorX + col * productWidth + productWidth / 2;
      const py = sectorY + sectorHeight * 0.75 + row * productHeight;
      
      // Draw product indicator (small box)
      const boxSize = Math.max(3, 6 * scale);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - boxSize / 2, py - boxSize / 2, boxSize, boxSize);
      
      // Draw product name (only if scale is large enough)
      if (scale > 0.8) {
        const fontSize = Math.max(6, 8 * scale);
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Truncate long names
        const maxChars = Math.floor(productWidth / (fontSize * 0.6));
        const displayName = product.name.length > maxChars 
          ? product.name.substring(0, maxChars - 1) + '…'
          : product.name;
        
        ctx.fillText(displayName, px, py + boxSize);
      }
    });
  });
}
