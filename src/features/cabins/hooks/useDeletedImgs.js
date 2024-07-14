import {useMutation} from "@tanstack/react-query";
import {deleteCabinImages as fetchDeleteCabinImages} from "../../../services/apiCabins.js";
import toast from "react-hot-toast";

export default function useDeletedImages(){
    const {isLoading: isDeletingImages, mutate: deleteCabinImages} = useMutation({
        mutationFn: ({collection})=> fetchDeleteCabinImages(collection),
        onError: error =>  toast.error(error.message)
    });
    return {isDeletingImages, deleteCabinImages};
}