import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as fetchCreateBooking } from "../../../services/apiBookings.js";
import toast from "react-hot-toast";

export function useCreateBooking() {
    const queryClient = useQueryClient();
    const { isLoading, mutate: createBooking } = useMutation({
        mutationFn: fetchCreateBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("New booking was successfully created");
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        },
    });
    return { isLoading, createBooking };
}