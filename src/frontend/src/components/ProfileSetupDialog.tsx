import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !storeName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        storeName: storeName.trim(),
        createdAt: BigInt(Date.now() * 1000000),
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] flex flex-col p-4 sm:p-6" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Welcome to HIPER SUPERMERCADO MANAGER</DialogTitle>
          <DialogDescription className="text-sm">
            Please set up your profile to get started
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name"
                required
                className="min-h-[44px]"
              />
            </div>
            <Button type="submit" className="w-full min-h-[44px]" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Creating...' : 'Create Profile'}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
