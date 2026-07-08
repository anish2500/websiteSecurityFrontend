import { handleGetOnePlant } from "@/lib/actions/admin/plant-action";
import UpdatePlantForm from "../../_components/UpdatePlantForm";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const response = await handleGetOnePlant(id);

    if (!response.success){
        throw new Error(response.message || 'Failed to load plant')
    }
    return (
        <div>
            <UpdatePlantForm plant = {response.data}/>
        </div>
    );
}