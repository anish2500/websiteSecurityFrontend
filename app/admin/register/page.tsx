"use client";

import AdminRegisterForm from "./AdminRegisterForm";

export default function AdminRegisterPage() {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-8"
            style={{ backgroundImage: "url('/images/signupbg.jpg')" }}
        >
            <AdminRegisterForm />
        </div>
    );
}
