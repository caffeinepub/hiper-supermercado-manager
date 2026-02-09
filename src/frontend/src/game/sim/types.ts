export interface GameState {
  tick: number;
  gameTime: number;
  customers: Customer[];
  employees: Employee[];
  cleanliness: number;
  reputation: number;
}

export interface Customer {
  id: string;
  x: number;
  y: number;
  type: 'Economic' | 'Demanding' | 'Impulsive' | 'Loyal' | 'Wholesaler';
  satisfaction: number;
  inQueue: boolean;
}

export interface Employee {
  id: string;
  x: number;
  y: number;
  role: 'Cashier' | 'Stocker' | 'Butcher' | 'Baker' | 'Warehouse' | 'Manager' | 'Cleaning' | 'Security' | 'Driver';
  productivity: number;
  fatigue: number;
}
