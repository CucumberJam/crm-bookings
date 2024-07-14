import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuest as fetchCreateGuest } from "../../../services/apiGuests.js";
import toast from "react-hot-toast";


export function useCreateGuest() {
    const queryClient = useQueryClient();
    const { isLoading: isCreating, mutate: createGuest } = useMutation({
        mutationFn: fetchCreateGuest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guests"] });
            toast.success("New guest was successfully created");
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        },
    });
    return { isCreating, createGuest };
}