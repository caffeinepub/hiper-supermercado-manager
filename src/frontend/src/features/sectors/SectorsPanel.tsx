import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useGetSectors } from '../../hooks/useQueries';
import { getSectorDefinition } from './sectorConstants';
import { Package, Users, TrendingUp, Star } from 'lucide-react';

export default function SectorsPanel() {
  const { data: sectors = [], isLoading } = useGetSectors();

  if (isLoading) {
    return <div className="p-4">Loading sectors...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Store Sectors</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage all departments in your supermarket
        </p>
      </div>

      <div className="grid gap-4">
        {sectors.map(sector => {
          const definition = getSectorDefinition(sector.name);
          const totalStock = sector.stock.reduce((sum, item) => sum + Number(item.quantity), 0);
          const stockValue = sector.stock.reduce(
            (sum, item) => sum + Number(item.quantity) * item.sellingPrice,
            0
          );

          return (
            <Card key={sector.name}>
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{definition?.icon}</span>
                    <span className="text-base sm:text-lg">{sector.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Quality: {Number(sector.qualityLevel)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Stock</div>
                      <div className="font-bold text-sm sm:text-base truncate">{totalStock} units</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="font-bold text-sm sm:text-base truncate">${stockValue.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Staff</div>
                      <div className="font-bold text-sm sm:text-base">{Number(sector.staffAssigned)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Cleanliness</div>
                      <div className="font-bold text-sm sm:text-base">{Number(sector.cleanliness)}%</div>
                    </div>
                  </div>
                </div>

                {sector.stock.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Product</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm">Quantity</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm">Price</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sector.stock.map(item => (
                            <TableRow key={item.productId}>
                              <TableCell className="font-medium text-xs sm:text-sm">{item.productId}</TableCell>
                              <TableCell className="text-right text-xs sm:text-sm">{Number(item.quantity)}</TableCell>
                              <TableCell className="text-right text-xs sm:text-sm">${item.sellingPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-xs sm:text-sm hidden sm:table-cell">
                                ${(Number(item.quantity) * item.sellingPrice).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {sector.stock.length === 0 && (
                  <div className="text-center py-6 text-xs sm:text-sm text-muted-foreground">
                    No products in stock
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
