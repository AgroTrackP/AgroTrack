"use server"

import axios from "axios"

export const axiosApiBack = axios.create ({
    baseURL: process.env.API_URL,  //http://localhost:3004
});