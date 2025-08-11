enum eRole {
    ADMIN = "admin",
    USER = "user"
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: eRole;
    credential: Credential;      
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
    id: string,
    plan: string,
    price: number,
    benefits: string[]
}
