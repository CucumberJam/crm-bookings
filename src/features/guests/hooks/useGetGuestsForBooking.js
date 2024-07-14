import {useQuery} from "@tanstack/react-query";
import {getGuestsSimply} from "../../../services/apiGuests.js";

export function useGetGuestsForBooking() {
    const { isLoading, data: guests } = useQuery({
        queryKey: ["guests", 'form'],
        queryFn: getGuestsSimply,
    });
    return { isLoading, guests };
}