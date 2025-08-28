export interface RecommendationSeed {
  crop_type: string;
  planting_notes?: string;
  recommended_water_per_m2?: number;
  recommended_fertilizer?: string;
  recommended_diseases: string[]; // nombres de las diseases
  recommended_products: string[]; // nombres de los products
  recommended_application_type: string; // nombre del tipo de aplicación
  additional_notes?: string;
}
