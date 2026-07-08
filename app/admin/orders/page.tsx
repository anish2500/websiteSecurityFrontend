import { handleGetAllOrders } from "@/lib/actions/admin/order-action";
import OrderTable from "./_components/orderTable";
export default async function Page() {
    const response = await handleGetAllOrders();
    if (!response.success) {
        throw new Error(response.message || 'Failed to load orders');
    }
    return (
        <div className="p-6 md:p-10 bg-slate-50/30 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Orders Management
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            View and manage all customer orders
                        </p>
                    </div>
                </div>
                <OrderTable orders={response.data} />
            </div>
        </div>
    );
}