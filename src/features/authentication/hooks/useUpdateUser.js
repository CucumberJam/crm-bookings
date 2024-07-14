import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {updateUser as fetchUpdateUser} from "../../../services/apiAuth.js";

export default function useUpdateUser(){
    const queryClient = useQueryClient();
    const {isLoading: isUpdating, mutate: updateUser} = useMutation({
        mutationFn: fetchUpdateUser,
        onSuccess: (data)=>{
            console.log(data.user);
            toast.success('User was successfully updated!');
            queryClient.setQueryData(['user'], data?.user);
        },
        onError: error =>  toast.error(error.message)
    });

    return {isUpdating, updateUser};
}