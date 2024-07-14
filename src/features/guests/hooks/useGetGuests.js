import {useQuery} from "@tanstack/react-query";
import { getGuests } from "../../../services/apiGuests.js";
import {useSearchParams} from "react-router-dom";

export default function useGetGuests() {
    const [searchParams] = useSearchParams();

    // FILTER:
    const filter = [];
    for(const key of ['fullName', 'email']){
        const filterValue = searchParams.get(key);
        filter.push(!filterValue ? null : {field: key, value: filterValue})
    }
    //SORT:
    const sortByRaw = searchParams.get('sortBy') || 'fullName-asc';
    const [sortField, sortDirection] = sortByRaw.split('-');
    const sortBy = {field: sortField, direction: sortDirection}

    //PAGINATION
    const currentPage = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

    const filterValue = filter.map(el => el ?`(${el?.field}-${el?.value})` : null)?.join(', ');

    const {isLoading,
        status,
        data: {data: guests, count} = {},
        error
    } = useQuery({
        queryKey: ['guests', filterValue, sortBy, currentPage], // to refetch data according to filter
        queryFn: ()=> getGuests({filter, sortBy, currentPage})
    });

    return { isLoading, status, error, guests, count };
}