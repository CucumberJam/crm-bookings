import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateGuest as fetchUpdateGuest} from "../../../services/apiGuests.js";
import toast from "react-hot-toast";

export default function useUpdateGuest(){
    const queryClient = useQueryClient();
    const {isLoading: isUpdating, mutate: updateGuest} = useMutation({
        mutationFn: ({updatedGuest, id})=> fetchUpdateGuest(updatedGuest, id),
        onSuccess: ()=>{
            toast.success('Guest was successfully updated!');
            queryClient.invalidateQueries({
                queryKey: ['guests']
            });
        },
        onError: error =>  toast.error(error.message)
    });

    return {isUpdating, updateGuest};
}