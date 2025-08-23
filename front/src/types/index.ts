enum eRole {
	ADMIN = "Admin",
	USER = "user",
}

export interface IUser {
	id?: string;
	name: string;
	email: string;
	role?: eRole;
	credential?: Credential;
	picture?: string;
	imgUrl?: string; // para el profileUploader
}

export interface RegisterUserDto {
	//post
	name: string;
	email: string;
	password: string;
	// address: string
	// phone: string
}
export interface LoginUserDto {
	// post
	email: string;
	password: string;
}

export interface ISuscription {
	id: string;
	name: string;
	price: number;
	maxUsers: number;
	maxDevices: number;
	features: string[];
	stripePriceId: string;
}

export interface LandDataDTO {
	name: string;
	area_m2: number;
	crop_type: string;
	season: string;
	location: string;
	start_date: string;
	userId?: string;
}
export interface IPlanDetails {
	id: string;
	name: string;
	price: string;
	maxUsers: number;
	maxDevices: number;
	features: string[];
	stripePriceId: string;
}

export interface IUserSubscription {
	userId: string;
	plan: IPlanDetails;
	status: "active" | "canceled" | "past_due"; // Usando tipos literales para seguridad
}

export interface IDetalleTerreno {
    name: string;
    email: string;
    memberSince: string;
}

export interface IApplicationPlan {
    id: string,
    planned_date: string,
    total_water: string;
    total_product: string;
    status: 'pending' | 'completed' | 'skipped';
}

export interface IRecommendedDisease{
    id: string;
    name: string;
    description: string
}

export interface IRecommendedApplicationType{
    id: string;
    name: string;
    description: string
}

export interface IRecommendedProducts{
    id: string;
    name: string;
    description: string
}

export interface IRecommendations {
    id: string;
    crop_type: string;
    planting_notes: string;
    recommended_water_per_m2: string;
    recommended_fertilizer: string;
    additional_notes: string;
    recommended_diseases: IRecommendedDisease[];
    recommended_products: IRecommendedProducts;
    recommended_application_type: IRecommendedApplicationType;
}
