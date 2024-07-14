import TableOperations from "../../ui/TablePanel.jsx";
import Filter from "../../ui/Filter.jsx";
import SortBy from "../../ui/SortBy.jsx";
import {cabinOptions} from "../../data/filter-options.js";
export default function CabinTableOperations(){
    return (
        <TableOperations>
            <Filter filterField='discount'
                    options={cabinOptions}/>

            <SortBy options={cabinOptions}/>
        </TableOperations>
    );
}