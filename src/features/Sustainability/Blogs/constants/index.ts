export enum BlogCategory {
    FOOD_WASTE_REDUCTION = "Food Waste Reduction",
    SUSTAINABLE_EATING = "Sustainable Eating",
    ZERO_WASTE_RECIPES = "Zero Waste Recipes",
    COMPOSTING_AND_RECYCLING = "Composting And Recycling",
    SUSTAINABLE_FOOD_PACKAGING = "Sustainable Food Packaging",
    FOOD_PRESERVATION_TECHNIQUES = "Food Preservation Techniques",
    LOCAL_FOOD_INITIATIVES = "Local Food Initiatives",
    CLIMATE_CHANGE_AND_FOOD_WASTE = "Climate Change And Food Waste",
    IMPACT_OF_FOOD_WASTE_ON_ENVIRONMENT = "Impact Of Food Waste On Environment",
    FOOD_DONATION_AND_REDISTRIBUTION = "Food Donation And Redistribution",
    SUSTAINABLE_FARMING_PRACTICES = "Sustainable Farming Practices",
    REDUCING_WASTE_IN_FOOD_INDUSTRY = "Reducing Waste In Food Industry",
    CONSUMER_BEHAVIOR_AND_FOOD_WASTE = "Consumer Behavior And Food Waste",
    INNOVATIONS_IN_FOOD_SUSTAINABILITY = "Innovations In Food Sustainability",
    FOOD_WASTE_IN_RETAIL_AND_RESTAURANTS = "Food Waste In Retail And Restaurants",
    POLICY_AND_ADVOCACY_FOR_FOOD_WASTE = "Policy And Advocacy For Food Waste",
    SUSTAINABLE_FOOD_SUPPLY_CHAINS = "Sustainable Food Supply Chains",
    CIRCULAR_ECONOMY_IN_FOOD_SYSTEMS = "Circular Economy In Food Systems",
    EDUCATIONAL_RESOURCES_ON_SUSTAINABILITY = "Educational Resources On Sustainability",
    CORPORATE_RESPONSIBILITY_IN_FOOD_WASTE = "Corporate Responsibility In Food Waste",
    OTHERS = "Others"
  }
  
  export enum SectionType {
    TEXT = "TEXT",
    IMAGE = "IMAGE"
  }
  
  export interface BlogSection {
    type: SectionType;
    content: string;
  }
  
  export interface Blog {
    blogId: number;
    title: string;
    subtitle: string;
    createdOn: Date;
    updatedOn: Date;
    category: BlogCategory;
    isPublished: boolean;
    sections: BlogSection[];
  }
  
  export interface BlogDto {
    blogId?: number;
    title: string;
    subtitle: string;
    category: BlogCategory;
    isPublished?: boolean;
    sections: BlogSection[];
  }