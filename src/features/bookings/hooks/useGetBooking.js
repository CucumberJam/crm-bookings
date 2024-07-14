import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getBooking} from "../../../services/apiBookings.js";


export default function useGetBooking(){
    const {bookingId} = useParams();

    const {isLoading, status, data: booking} = useQuery({
        queryKey: ['bookings', bookingId],
        queryFn: ()=> getBooking(bookingId),
        retry: false
    });

    return {isLoading, status, booking, bookingId};
}