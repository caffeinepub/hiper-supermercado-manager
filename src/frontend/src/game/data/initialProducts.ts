export const INITIAL_PRODUCTS = [
  // Produce
  { productId: 'prod_apple', name: 'Apples', baseCost: 1.5, sellPrice: 2.99, sector: 'Produce', shelfLife: BigInt(7 * 24 * 3600) },
  { productId: 'prod_banana', name: 'Bananas', baseCost: 0.8, sellPrice: 1.49, sector: 'Produce', shelfLife: BigInt(5 * 24 * 3600) },
  { productId: 'prod_tomato', name: 'Tomatoes', baseCost: 2.0, sellPrice: 3.49, sector: 'Produce', shelfLife: BigInt(5 * 24 * 3600) },
  
  // Butcher
  { productId: 'meat_beef', name: 'Beef', baseCost: 8.0, sellPrice: 12.99, sector: 'Butcher', shelfLife: BigInt(3 * 24 * 3600) },
  { productId: 'meat_chicken', name: 'Chicken', baseCost: 5.0, sellPrice: 7.99, sector: 'Butcher', shelfLife: BigInt(3 * 24 * 3600) },
  
  // Fish
  { productId: 'fish_salmon', name: 'Salmon', baseCost: 10.0, sellPrice: 15.99, sector: 'Fish', shelfLife: BigInt(2 * 24 * 3600) },
  
  // Bakery
  { productId: 'bakery_bread', name: 'Bread', baseCost: 1.0, sellPrice: 2.49, sector: 'Bakery', shelfLife: BigInt(3 * 24 * 3600) },
  { productId: 'bakery_croissant', name: 'Croissants', baseCost: 2.0, sellPrice: 3.99, sector: 'Bakery', shelfLife: BigInt(2 * 24 * 3600) },
  
  // Dairy
  { productId: 'dairy_milk', name: 'Milk', baseCost: 2.0, sellPrice: 3.49, sector: 'Dairy', shelfLife: BigInt(7 * 24 * 3600) },
  { productId: 'dairy_cheese', name: 'Cheese', baseCost: 4.0, sellPrice: 6.99, sector: 'Dairy', shelfLife: BigInt(14 * 24 * 3600) },
  
  // Grocery
  { productId: 'grocery_rice', name: 'Rice', baseCost: 3.0, sellPrice: 5.99, sector: 'Grocery', shelfLife: BigInt(365 * 24 * 3600) },
  { productId: 'grocery_pasta', name: 'Pasta', baseCost: 1.5, sellPrice: 2.99, sector: 'Grocery', shelfLife: BigInt(365 * 24 * 3600) },
  
  // Drinks
  { productId: 'drink_water', name: 'Water', baseCost: 0.5, sellPrice: 1.49, sector: 'Drinks', shelfLife: BigInt(365 * 24 * 3600) },
  { productId: 'drink_soda', name: 'Soda', baseCost: 1.0, sellPrice: 2.49, sector: 'Drinks', shelfLife: BigInt(180 * 24 * 3600) },
  
  // Frozen
  { productId: 'frozen_pizza', name: 'Frozen Pizza', baseCost: 3.0, sellPrice: 5.99, sector: 'Frozen', shelfLife: BigInt(90 * 24 * 3600) },
  
  // Cleaning
  { productId: 'clean_detergent', name: 'Detergent', baseCost: 4.0, sellPrice: 7.99, sector: 'Cleaning', shelfLife: BigInt(365 * 24 * 3600) },
  
  // Hygiene
  { productId: 'hygiene_soap', name: 'Soap', baseCost: 2.0, sellPrice: 3.99, sector: 'Hygiene', shelfLife: BigInt(365 * 24 * 3600) },
  
  // Pet
  { productId: 'pet_food', name: 'Pet Food', baseCost: 5.0, sellPrice: 9.99, sector: 'Pet', shelfLife: BigInt(180 * 24 * 3600) },
  
  // Electronics
  { productId: 'elec_battery', name: 'Batteries', baseCost: 3.0, sellPrice: 5.99, sector: 'Electronics', shelfLife: BigInt(365 * 24 * 3600) },
  
  // HomeGoods
  { productId: 'home_towel', name: 'Towels', baseCost: 5.0, sellPrice: 9.99, sector: 'HomeGoods', shelfLife: BigInt(365 * 24 * 3600) },
  
  // Bazaar
  { productId: 'bazaar_toy', name: 'Toys', baseCost: 8.0, sellPrice: 14.99, sector: 'Bazaar', shelfLife: BigInt(365 * 24 * 3600) },
  
  // Pharmacy
  { productId: 'pharm_vitamins', name: 'Vitamins', baseCost: 6.0, sellPrice: 11.99, sector: 'Pharmacy', shelfLife: BigInt(365 * 24 * 3600) },
  
  // Organics
  { productId: 'org_apple', name: 'Organic Apples', baseCost: 3.0, sellPrice: 5.99, sector: 'Organics', shelfLife: BigInt(7 * 24 * 3600) },
  
  // Wholesale
  { productId: 'whole_rice', name: 'Rice (Bulk)', baseCost: 15.0, sellPrice: 24.99, sector: 'Wholesale', shelfLife: BigInt(365 * 24 * 3600) },
];
