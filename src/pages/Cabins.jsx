import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from '../features/cabins/CabinTable-v2.jsx'
import AddCabin from "../features/cabins/AddCabin.jsx";
import {cabinFilter} from "../data/filter-options.js";
import {cabinSort} from "../data/sort-options.js";
import TablePanel from "../ui/TablePanel.jsx";
function Cabins() {

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">All cabins</Heading>
                <TablePanel filterOptions={cabinFilter}
                            sortOptions={cabinSort}/>
            </Row>

            <Row>
                <CabinTable/>
                <AddCabin name={'cabins-form'}/>
            </Row>
        </>
    );
}

export default Cabins;
