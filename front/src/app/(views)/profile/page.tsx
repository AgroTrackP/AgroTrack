import React from "react";
import UserData from "./components/userData";

const PageProfile = () => {

return (
    <div style={{    
        margin: "2rem", 
        padding: "2rem", 
        border: "1px solid #ddd", 
        borderRadius: 8 }}>

    <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem", color: "#1b1a1aff" }}>Perfil de Usuario</h2>

    <div
        style={{
            color: "1b1a1aff",
            marginBottom: "2rem",
            backgroundImage: "url('https://images.unsplash.com/photo-1568051775670-83722f73f3de?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 12,
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(3, 3, 3, 0.1)",
        }}
    >
    <UserData/>
    </div>
    <div>
    <h3>info de terrenos</h3>
    {/* <Terrain/> */}
    </div>
        <div>
    <h3>Informacion del plan</h3>
    {/* <PlanInfo/> */}
    </div>
        <div>
    <h3>Update User</h3>
    
    </div>
    </div>
    
);
};

export default PageProfile;