import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateBooking} from "../../../services/apiBookings.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function useCheckoutWithRefund(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate: checkoutWithRefund, isLoading: isCheckingOutWithRefund} = useMutation({
        mutationFn: (({bookingId, refund})=> updateBooking(bookingId, {
            status: 'checked-out',
            ...refund
        })),
        onSuccess: (data)=>{
            toast.success(`Booking #${data.id} was successfully checked out with refund!`);
            //queryClient.invalidateQueries({queryKey: ['bookings', data.id]});
            queryClient.invalidateQueries({active:true});
            navigate(`/bookings/${data.id}`);
        },
        onError: error =>  toast.error('There was an error while checkin out with refund')
    });

    return {checkoutWithRefund, isCheckingOutWithRefund};
}