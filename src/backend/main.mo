import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Time "mo:core/Time";
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

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Admin-only function to get all user profiles
  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.toArray();
  };

  // Store management
  public shared ({ caller }) func createStore() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create stores");
    };
    if (storeState.containsKey(caller)) {
      Runtime.trap("Store already exists");
    };
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

  // Admin-only test function
  public shared ({ caller }) func testInitialization() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can test initialization");
    };
    // Initialization check: verify if storeState has been initialized
    storeState.size() == 0;
  };
};
