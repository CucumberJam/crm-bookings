import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getGuest} from "../../../services/apiGuests.js";


export default function useGetGuest(){
    const {guestId} = useParams();

    const {isLoading, status, data: guest} = useQuery({
        queryKey: ['guests', guestId],
        queryFn: ()=> getGuest(guestId),
        retry: false
    });

    return {isLoading, status, guest, guestId};
}