import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getCabin} from "../../../services/apiCabins.js";


export default function useGetCabin(){
    const {cabinId} = useParams();

    const {isLoading, status, data: cabin} = useQuery({
        queryKey: ['cabins', cabinId],
        queryFn: ()=> getCabin(cabinId),
        retry: false
    });

    return {isLoading, status, cabin, cabinId};
}