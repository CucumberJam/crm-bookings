import Spinner from "../../ui/Spinner.jsx";
import CabinRow from "./CabinRow-v2.jsx";
import useGetCabins from "./hooks/useGetCabins.js";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";
import {useSearchParams} from "react-router-dom";
import {useCallback, useMemo} from "react";
import Empty from "../../ui/Empty.jsx";


function CabinTable(){
    const {isLoading, status, cabins} = useGetCabins();
    const [searchParams] = useSearchParams();

    //1 Filter:
    const filterValue = searchParams.get('discount') || 'all';
    const filteredCabins = useMemo(() => {
            if(!cabins) return;
            return (filterValue === 'all') ? cabins : (
                (filterValue === 'no') ? cabins.filter(cabin => cabin.discount === 0) :
                    cabins.filter(cabin => cabin.discount > 0)
            )
        }, [filterValue, cabins]);

    //2 Sort:
    const sortBy = searchParams.get('sortBy') || 'name-asc';
    const sortedCabins = useMemo(()=> {
        if(!filteredCabins) return;
        const [sortField, sortDirection] = sortBy.split('-');

        switch (sortField){
            case('name'):
                filteredCabins?.sort((a, b)=> a.name.localeCompare(b.name));
                break;
            case('regularPrice'):
                filteredCabins?.sort((a, b)=> a.regularPrice - (b.regularPrice));
                break;
            case('maxCapacity'):
                filteredCabins?.sort((a, b)=> a.maxCapacity - (b.maxCapacity));
                break;
            default:
                break;
        }
        return sortDirection === 'asc' ? filteredCabins : filteredCabins?.reverse();
    }, [sortBy, filteredCabins]);

    const renderCabins = useCallback((el) => <CabinRow cabin={el} key={el.id}/>, []);

    if(isLoading) return <Spinner/>
    if(!cabins.length) return <Empty resource='Cabins'/>
    return (
        <Menus>
            <Table columns='0.6fr 1.8fr 2.2fr 1fr 1fr 1fr'>
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>
                {status === 'success' && (
                    <Table.Body data={sortedCabins} render={renderCabins}/>
                )}
            </Table>
        </Menus>
    );
}
export default CabinTable;