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
