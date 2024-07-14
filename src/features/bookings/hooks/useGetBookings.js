import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBookings} from "../../../services/apiBookings.js";
import {useParams, useSearchParams} from "react-router-dom";
import {PAGE_SIZE} from "../../../utils/constants.js";

export default function useGetBookings(){
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    // FILTER:
    /*const filterValue = searchParams.get('status');
    const filter = !filterValue || filterValue === 'all' ? null
        : {field: 'status', value: filterValue} //{field: 'totalPrice', method: 'gte', value: 5000}
    // if need several filters use array of them and in getBookings via loop add to query params from array of filters*/

    const filter = [];
    const {guestId} = useParams();
    if(guestId) filter.push({field: 'guestId', value: guestId});
    const filterValue = searchParams.get('status');
    filter.push(!filterValue || filterValue === 'all' ? null : {field: 'status', value: filterValue})

    //SORT:
    const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
    const [sortField, sortDirection] = sortByRaw.split('-');
    const sortBy = {field: sortField, direction: sortDirection}

    //PAGINATION
    const currentPage = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

    const filterCache = filter.map(el => el ?`(${el?.field}-${el?.value})` : null)?.join(', ');

    const {isLoading,
        status,
        data: {data: bookings, count} = {},
        error
    } = useQuery({
        queryKey: ['bookings', filterCache, sortBy, currentPage], // to refetch data according to filter
        queryFn: ()=> getBookings({filter, sortBy, currentPage})
    });


    // PRE-fetching
    const pageCount = Math.ceil(count / PAGE_SIZE);

    if(currentPage < pageCount){
        queryClient.prefetchQuery({
            queryKey: ['bookings', filterCache, sortBy, currentPage+1],
            queryFn: ()=> getBookings({filter, sortBy, currentPage: currentPage+1})

        });
    }

    if(currentPage > 1 ){
        queryClient.prefetchQuery({
            queryKey: ['bookings', filterCache, sortBy, currentPage-1],
            queryFn: ()=> getBookings({filter, sortBy, currentPage: currentPage-1})

        });
    }

    return {isLoading, status, error, bookings, count};
}