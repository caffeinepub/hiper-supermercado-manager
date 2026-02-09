import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Info } from 'lucide-react';

export default function AboutDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg" className="w-full">
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>HIPER SUPERMERCADO MANAGER</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            A complete supermarket management simulation game where you build and manage your own hypermarket empire.
          </p>
          <p>
            Manage departments, staff, inventory, customers, finances, and grow from a small market to a full hypermarket chain.
          </p>
          <div className="pt-4 border-t text-center">
            <p className="font-semibold text-foreground">© ITA Games Studios – All rights reserved</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
