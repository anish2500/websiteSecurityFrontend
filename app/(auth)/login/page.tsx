"use client";

import LoginForm from "../_components/LoginForm";

export default function Page() {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-8"
            style={{ backgroundImage: "url('/images/signupbg.jpg')" }}
        >
            <LoginForm />
        </div>
    );
}