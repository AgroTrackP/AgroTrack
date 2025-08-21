enum eRole {
    ADMIN = "admin",
    USER = "user"
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

export interface RegisterUserDto { //post
    name: string
    email: string
    password: string
    // address: string
    // phone: string
}
export interface LoginUserDto {  // post
    email: string
    password: string
}

// export interface ISuscription{
//     priceId: string,
//     name: string,
//     price: number,
//     benefits: string[]
// }
export interface ISuscription{
    id: string,
    name: string,
    price: number,
    maxUsers: number,
    maxDevices: number,
    features: string[],
    stripePriceId:string
    //Estas propiedades son las que se usan para mostrar es estado de la suscripcion 
    status?: string,
    planName?: string,
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
export interface IUSerSuscription{
    status: string,
    planName: string;
}


