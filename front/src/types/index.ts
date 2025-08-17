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

export interface ISuscription{
    priceId: string,
    name: string,
    price: number,
    benefits: string[]
}
