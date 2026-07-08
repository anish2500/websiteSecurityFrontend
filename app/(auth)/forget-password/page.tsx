import ForgetPasswordForm from "../_components/ForgetPasswordForm";

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <span className="material-icons text-white text-2xl">lock_open</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 font-montserrat">Reset Your Password</h2>
                    <p className="text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                {/* Form */}
                <ForgetPasswordForm />
            </div>
        </div>
    );
}