"use client";
// import Loader from "@/components/ui/loader/loader";
import { useAuthContext } from "@/context/authContext";
import React from "react";


const UserData = () => {
    const {user} = useAuthContext();

    if(user === null) {
        // return <Loader minHeight="35vh"/>;
    }
    
    if(!user) {
        return <div>No user data available</div>;
    }

    return (
<div className="mb-8 space-y-2">
    <p>
        <span className="font-semibold">Nombre:</span> {user.name}
    {/* Cannot find name 'user'. */}
    </p>
    <p>
        <span className="font-semibold">Email:</span> {user.email}
    {/* Cannot find name 'user'. */}
    </p>
    <p>
        <span className="font-semibold">Rol:</span> {user.role}
    {/* Cannot find name 'user'. */}
    </p>
</div>
    )
}

export default UserData;