import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateBooking} from "../../../services/apiBookings.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function useCheckin(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate: checkin, isLoading: isCheckingIn} = useMutation({
        mutationFn: (({bookingId, breakfast})=> updateBooking(bookingId, {
            status: 'checked-in',
            isPaid: true,
            ...breakfast,
        })),
        onSuccess: (data)=>{
            toast.success(`Booking #${data.id} was successfully checked in!`);
            //queryClient.invalidateQueries({queryKey: ['bookings', data.id]});
            queryClient.invalidateQueries({active:true});
            navigate(`/bookings/${data.id}`);
        },
        onError: error =>  toast.error('There was an error while checkin in')
    });

    return {checkin, isCheckingIn};
}