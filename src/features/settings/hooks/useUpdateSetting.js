import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {updateSetting as updateSettingAPI} from "../../../services/apiSettings.js";

export default function useUpdateSetting(){
    const queryClient = useQueryClient();
    const {isLoading: isUpdating, mutate: updateSetting} = useMutation({
        mutationFn: updateSettingAPI,
        onSuccess: ()=>{
            toast.success('Setting was successfully updated!');
            queryClient.invalidateQueries({
                queryKey: ['settings']
            });
        },
        onError: error =>  toast.error(error.message)
    });

    return {isUpdating, updateSetting};
}