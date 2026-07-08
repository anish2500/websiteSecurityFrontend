import ResetPasswordForm from "../_components/ResetPasswordForm";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const token = query.token as string | undefined;
    if(!token){
        throw new Error('Invalid or missing token');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <span className="material-icons text-white text-2xl">lock_reset</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 font-montserrat">Set New Password</h2>
                    <p className="text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}