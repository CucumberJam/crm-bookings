import {useQuery} from "@tanstack/react-query";
import {getBookingsByCabinIdOfDate} from "../../../services/apiBookings.js";
import toast from "react-hot-toast";

export default function useGetBookingsByCabinIdWithDate({date, cabinId}){
    const {isLoading, status, data: bookings} = useQuery({
        queryKey: ['bookings-cabinId-date', `${cabinId}-${date}`],
        queryFn: () => getBookingsByCabinIdOfDate(date, cabinId),
        onError: (error) => {
            console.log(error);
            toast.error(error.message);
        },
    });

    return {isLoading, status, bookings};
}