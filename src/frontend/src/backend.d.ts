import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StoreSectorSnapshot {
    name: string;
    qualityLevel: bigint;
    stock: Array<StockItem>;
    staffAssigned: bigint;
    cleanliness: bigint;
}
export interface StockItem {
    purchasePrice: number;
    sellingPrice: number;
    productId: string;
    expirationTime: bigint;
    quantity: bigint;
}
export interface Delivery {
    arrivalTime: bigint;
    supplierName: string;
    productId: string;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
    createdAt: bigint;
    storeName: string;
}
export interface Product {
    id: string;
    name: string;
    sector: string;
    sellPrice: number;
    shelfLife: bigint;
    baseCost: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(productId: string, name: string, baseCost: number, sellPrice: number, sector: string, shelfLife: bigint): Promise<void>;
    addSector(sectorName: string): Promise<void>;
    addSupplier(supplierName: string, priceModifier: number, deliveryTime: bigint, quality: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createStore(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFunds(): Promise<number>;
    getPendingDeliveries(): Promise<Array<Delivery>>;
    getReputation(): Promise<number>;
    getSectors(): Promise<Array<StoreSectorSnapshot>>;
    getStoreProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    orderStock(productId: string, quantity: bigint, supplierName: string): Promise<void>;
    receiveDeliveries(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
