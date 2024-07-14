import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteBooking as deleteBookingAPI} from "../../../services/apiBookings.js";
import toast from "react-hot-toast";
export default function useDeleteBooking(){
    const queryClient = useQueryClient();

    const {isLoading: isDeleting, mutate: deleteBooking} = useMutation({
        mutationFn: deleteBookingAPI,
        onSuccess: ()=>{
            toast.success(`Booking successfully deleted!`);
            queryClient.invalidateQueries({
                queryKey: ['bookings']
            });
        },
        onError: error =>  toast.error(error.message)//'There was an error while deleting booking'
    })
    return {isDeleting, deleteBooking};
}