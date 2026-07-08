import CreateUserForm from "../_components/CreateUserForm";

export default function CreateUserPage() {
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New User</h1>
            <CreateUserForm />
        </div>
    );
}
