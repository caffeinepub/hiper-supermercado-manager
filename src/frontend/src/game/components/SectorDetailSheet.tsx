import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { getSectorDefinition } from '../../features/sectors/sectorConstants';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface SectorDetailSheetProps {
  sectorName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SectorDetailSheet({ sectorName, open, onOpenChange }: SectorDetailSheetProps) {
  if (!sectorName) return null;
  
  const sectorDef = getSectorDefinition(sectorName);
  if (!sectorDef) return null;
  
  // Get products for this sector
  const sectorProducts = INITIAL_PRODUCTS.filter(p => p.sector === sectorName);
  
  // Mock metrics (since backend doesn't provide them yet)
  const metrics = {
    quality: 85,
    stockValue: sectorProducts.reduce((sum, p) => sum + p.sellPrice * 10, 0),
    staff: 2,
    cleanliness: 90,
    productCount: sectorProducts.length,
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80dvh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{sectorDef.icon}</span>
            {sectorDef.name}
          </SheetTitle>
          <SheetDescription>{sectorDef.description}</SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Quality</div>
              <div className="text-2xl font-bold" style={{ color: sectorDef.color }}>
                {metrics.quality}%
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Stock Value</div>
              <div className="text-2xl font-bold text-green-500">
                ${metrics.stockValue.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Staff</div>
              <div className="text-2xl font-bold text-blue-500">
                {metrics.staff}
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Cleanliness</div>
              <div className="text-2xl font-bold text-purple-500">
                {metrics.cleanliness}%
              </div>
            </div>
          </div>
          
          {/* Products List */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Products ({metrics.productCount})
            </h3>
            <div className="space-y-2">
              {sectorProducts.map(product => (
                <div
                  key={product.productId}
                  className="bg-card border border-border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Cost: ${product.baseCost.toFixed(2)} • Sell: ${product.sellPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Stock: ~10
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
