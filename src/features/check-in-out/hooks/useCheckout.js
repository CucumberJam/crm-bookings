import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateBooking} from "../../../services/apiBookings.js";
import toast from "react-hot-toast";

export default function useCheckout(){
    const queryClient = useQueryClient();

    const {mutate: checkout, isLoading: isCheckingOut} = useMutation({
        mutationFn: ((bookingId)=> updateBooking(bookingId, {
            status: 'checked-out',
        })),
        onSuccess: (data)=>{
            toast.success(`Booking #${data.id} was successfully checked out!`);
            //queryClient.invalidateQueries({queryKey: ['bookings', data.id]});
            queryClient.invalidateQueries({active:true});
        },
        onError: error =>  toast.error('There was an error while checkin out')
    });

    return {checkout, isCheckingOut};
}