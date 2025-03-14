export const foodCategoryMapping: Record<string, string> = {
    FRUITS_AND_VEGETABLES: "Fruits and Vegetables",
    FROZEN: "Frozen",
    CANNED_GOODS: "Canned Goods",
    DAIRY_AND_EGGS: "Dairy and Eggs",
    DRY_GOODS_AND_STAPLES: "Dry Goods and Staples"
  };
  
  export const foodConditionMapping: Record<string, string> = {
    BRUISED: "Bruised",
    UGLY: "Ugly",
    NEAR_EXPIRY: "Near Expiry",
    DAMAGED_PACKAGING: "Damaged Packaging",
  };
  
  export const deliveryMethodMapping: Record<string, string> = {
    SELF_PICK_UP: "Self Pickup",
    DOORSTEP_DELIVERY: "Doorstep Delivery",
  };

  export interface Distributor {
      distributorId: number;
      distributorName: string;
      address: number;
      email: string;
      name: string;
      contactName: string;
      warehouseAddress: number;
      isApproved: Boolean;
      boostCount: number;
  }

  export const boostStatusMapping: Record<string, string> = {
    NONE: "None",
    NOT_STARTED: "Not Started",
    ACTIVE: "Active",
    PAUSED: "Paused",
    COMPLETED: "Completed"
  };
