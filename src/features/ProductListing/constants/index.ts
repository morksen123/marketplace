export const createProductListingDefaultValues = {
  category: '',
  title: '',
  condition: '',
  expirationDate: '',
  price: 0, 
  description: '',
}

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

export const unitMapping: Record<string, string> = {
  FRUITS_AND_VEGETABLES: "kg",
  FROZEN: "kg",
  CANNED_GOODS: "can",
  DAIRY_AND_EGGS: "unit",
  DRY_GOODS_AND_STAPLES: "unit",
};