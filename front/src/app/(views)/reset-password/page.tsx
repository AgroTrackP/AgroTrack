"use client";

import React from "react";
import ResetPasswordForm from "./components/resetPasswordForm";


const ResetPage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
        <div
            className="rounded-xl p-6 shadow-lg bg-cover bg-center"
            style={{
            backgroundImage:
                "url('https://images.unsplash.com/photo-1568051775670-83722f73f3de?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0')",
        }}
    >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
            <ResetPasswordForm />
        </div>
    </div>
    </div>
);
};

export default ResetPage;