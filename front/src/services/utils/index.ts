"use server"

import axios from "axios";

export const axiosApiBack = axios.create({
    baseURL: "https://agrotrack-develop.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});