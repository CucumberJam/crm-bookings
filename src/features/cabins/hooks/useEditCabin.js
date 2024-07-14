import {useMutation, useQueryClient} from "@tanstack/react-query";
import {editCabin as fetchEditCabin} from "../../../services/apiCabins.js";
import toast from "react-hot-toast";

export default function useEditCabin(){
    const queryClient = useQueryClient();
    const {isLoading: isEditing, mutate: editCabin} = useMutation({
        mutationFn: fetchEditCabin, // ({newCabinData, id})=> createEditCabin(newCabinData, id),
        onSuccess: ()=>{
            toast.success('Cabin was successfully updated!');
            queryClient.invalidateQueries({
                queryKey: ['cabins']
            });
        },
        onError: error =>  toast.error(error.message)
    });

    return {isEditing, editCabin};
}