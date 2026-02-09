import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type StoreSector = {
    name : Text;
    stock : Map.Map<Text, StockItem>;
    cleanliness : Nat;
    staffAssigned : Nat;
    qualityLevel : Nat;
  };

  public type StockItem = {
    productId : Text;
    quantity : Nat;
    purchasePrice : Float;
    sellingPrice : Float;
    expirationTime : Int;
  };

  public type Product = {
    id : Text;
    name : Text;
    baseCost : Float;
    sellPrice : Float;
    sector : Text;
    shelfLife : Nat; // in seconds
  };

  public type Supplier = {
    name : Text;
    priceModifier : Float;
    deliveryTime : Nat; // in seconds
    quality : Nat;
  };

  public type StoreState = {
    sectors : Map.Map<Text, StoreSector>;
    products : Map.Map<Text, Product>;
    suppliers : Map.Map<Text, Supplier>;
    funds : Float;
    reputation : Float;
    deliveries : Map.Map<Nat, Delivery>;
  };

  public type StoreSectorSnapshot = {
    name : Text;
    stock : [StockItem];
    cleanliness : Nat;
    staffAssigned : Nat;
    qualityLevel : Nat;
  };

  public type Delivery = {
    productId : Text;
    quantity : Nat;
    arrivalTime : Int;
    supplierName : Text;
  };

  public type UserProfile = {
    name : Text;
    storeName : Text;
    createdAt : Int;
  };

  // Persistent Store State
  let storeState = Map.empty<Principal, StoreState>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Delivery Time Sorting
  module DeliveryModule {
    public func compare(a : Delivery, b : Delivery) : Order.Order {
      Int.compare(a.arrivalTime, b.arrivalTime);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Store management
  public shared ({ caller }) func createStore() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create stores");
    };
    if (storeState.containsKey(caller)) { Runtime.trap("Store already exists") };
    let initialState : StoreState = {
      sectors = Map.empty<Text, StoreSector>();
      products = Map.empty<Text, Product>();
      suppliers = Map.empty<Text, Supplier>();
      funds = 10000.0; // Starting funds
      reputation = 3.0; // Initial reputation score
      deliveries = Map.empty<Nat, Delivery>();
    };
    storeState.add(caller, initialState);
  };

  public shared ({ caller }) func addSector(sectorName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add sectors");
    };
    let state = switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?state) { state };
    };

    if (state.sectors.containsKey(sectorName)) {
      Runtime.trap("Sector already exists");
    };

    let newSector : StoreSector = {
      name = sectorName;
      stock = Map.empty<Text, StockItem>();
      cleanliness = 100;
      staffAssigned = 0;
      qualityLevel = 1;
    };

    state.sectors.add(sectorName, newSector);
    storeState.add(caller, state);
  };

  public shared ({ caller }) func addProduct(productId : Text, name : Text, baseCost : Float, sellPrice : Float, sector : Text, shelfLife : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add products");
    };
    let state = switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?st) { st };
    };

    if (state.products.containsKey(productId)) {
      Runtime.trap("Product already exists");
    };

    let newProduct : Product = {
      id = productId;
      name;
      baseCost;
      sellPrice;
      sector;
      shelfLife;
    };

    state.products.add(productId, newProduct);
    storeState.add(caller, state);
  };

  public shared ({ caller }) func addSupplier(supplierName : Text, priceModifier : Float, deliveryTime : Nat, quality : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add suppliers");
    };
    let state = switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?st) { st };
    };

    if (state.suppliers.containsKey(supplierName)) {
      Runtime.trap("Supplier already exists");
    };

    let newSupplier : Supplier = {
      name = supplierName;
      priceModifier;
      deliveryTime;
      quality;
    };

    state.suppliers.add(supplierName, newSupplier);
    storeState.add(caller, state);
  };

  // Inventory and logistics
  public shared ({ caller }) func orderStock(productId : Text, quantity : Nat, supplierName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can order stock");
    };
    let state = switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?st) { st };
    };

    let product = switch (state.products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?prod) { prod };
    };

    let supplier = switch (state.suppliers.get(supplierName)) {
      case (null) { Runtime.trap("Supplier not found") };
      case (?sup) { sup };
    };

    let finalCost = product.baseCost * supplier.priceModifier * quantity.toFloat();
    if (state.funds < finalCost) {
      Runtime.trap("Insufficient funds for this order");
    };

    let deliveryId = Int.abs(Time.now()) + state.deliveries.size();
    let delivery : Delivery = {
      productId;
      quantity;
      arrivalTime = Time.now() + supplier.deliveryTime;
      supplierName = supplier.name;
    };

    // Deduct funds
    let updatedState = {
      state with
      funds = state.funds - finalCost;
    };

    updatedState.deliveries.add(deliveryId, delivery);
    storeState.add(caller, updatedState);
  };

  public shared ({ caller }) func receiveDeliveries() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can receive deliveries");
    };
    let state = switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?st) { st };
    };

    // Process deliveries that have arrived
    let currentTime = Time.now();
    let arrivedDeliveryIds = List.empty<Nat>();

    for ((id, delivery) in state.deliveries.entries()) {
      if (delivery.arrivalTime <= currentTime) {
        // Update stock in sector
        let product = switch (state.products.get(delivery.productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?prod) { prod };
        };

        let sector = switch (state.sectors.get(product.sector)) {
          case (null) { Runtime.trap("Sector not found") };
          case (?sec) { sec };
        };

        let existingStock = switch (sector.stock.get(delivery.productId)) {
          case (null) {
            {
              productId = delivery.productId;
              quantity = 0;
              purchasePrice = product.baseCost;
              sellingPrice = product.sellPrice;
              expirationTime = Time.now() + product.shelfLife;
            };
          };
          case (?existing) { existing };
        };

        let stockItem : StockItem = {
          productId = delivery.productId;
          quantity = existingStock.quantity + delivery.quantity;
          purchasePrice = product.baseCost;
          sellingPrice = product.sellPrice;
          expirationTime = Time.now() + product.shelfLife;
        };

        sector.stock.add(delivery.productId, stockItem);

        // Collect arrived delivery id
        arrivedDeliveryIds.add(id);
      };
    };

    // Remove arrived deliveries from pending deliveries
    for (id in arrivedDeliveryIds.values()) {
      state.deliveries.remove(id);
    };

    storeState.add(caller, state);
  };

  public query ({ caller }) func getStoreProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view store products");
    };
    switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?state) {
        state.products.values().toArray();
      };
    };
  };

  public query ({ caller }) func getSectors() : async [StoreSectorSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sectors");
    };
    switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?state) {
        state.sectors.values().toArray().map(
          func(sector) {
            {
              name = sector.name;
              stock = sector.stock.values().toArray();
              cleanliness = sector.cleanliness;
              staffAssigned = sector.staffAssigned;
              qualityLevel = sector.qualityLevel;
            };
          }
        );
      };
    };
  };

  public query ({ caller }) func getPendingDeliveries() : async [Delivery] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pending deliveries");
    };
    switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?state) {
        let deliveries = state.deliveries.values().toArray();
        deliveries.sort();
      };
    };
  };

  // Helper function
  public query ({ caller }) func getFunds() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view funds");
    };
    switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?state) { state.funds };
    };
  };

  public query ({ caller }) func getReputation() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reputation");
    };
    switch (storeState.get(caller)) {
      case (null) { Runtime.trap("Store does not exist") };
      case (?state) { state.reputation };
    };
  };
};
