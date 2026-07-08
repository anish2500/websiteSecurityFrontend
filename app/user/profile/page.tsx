"use client";
import { useAuth } from "@/context/AuthContext";
import { notFound } from "next/navigation";
import UpdateForm from "./_components/UpdateForm";

export default function Page() {
    const { user } = useAuth();

    if (!user) {
        return notFound();
    }

    return (
        <div>
            <UpdateForm user={user} />
        </div>
    );
}