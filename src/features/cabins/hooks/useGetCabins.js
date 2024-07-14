import {useQuery} from "@tanstack/react-query";
import {getCabins} from "../../../services/apiCabins.js";

export default function useGetCabins(){
    const {isLoading, status, data: cabins} = useQuery({
        queryKey: ['cabins'],
        queryFn: getCabins
    });

    return {isLoading, status, cabins};
}