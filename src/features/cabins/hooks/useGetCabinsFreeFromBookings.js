import {useQuery} from "@tanstack/react-query";
import {getCabinsFreeFromBookings} from "../../../services/apiCabins.js";

export default function useGetCabinsFreeFromBookings({startDate, endDate}){
    const {isLoading, status, data: cabins} = useQuery({
        queryKey: ['cabins-free-from-booking', `${startDate}-${endDate}`],
        queryFn: () => getCabinsFreeFromBookings(startDate, endDate),
        onError: (err) => {
            console.log(err);
        },
    });

    return {isLoading, status, cabins};
}