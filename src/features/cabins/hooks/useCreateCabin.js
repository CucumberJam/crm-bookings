import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createCabin as fetchCreateCabin} from "../../../services/apiCabins.js";
import toast from "react-hot-toast";

export default function useCreateCabin(){
    const queryClient = useQueryClient();
    const {isLoading: isCreating, mutate: createCabin} = useMutation({
        mutationFn: fetchCreateCabin, // createEditCabin
        onSuccess: ()=>{
            toast.success('Cabin successfully created!');
            queryClient.invalidateQueries({
                queryKey: ['cabins']
            });
        },
        onError: error =>  toast.error(error.message)
    });

    return {isCreating, createCabin};
}