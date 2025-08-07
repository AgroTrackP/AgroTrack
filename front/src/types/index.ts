export interface RegisterUserDto { //post
    name: string
    email: string
    password: string
    address: string
    phone: string
}

export interface ISuscription{
    id: string,
    plan: string,
    price: number,
    benefits: string[]
}