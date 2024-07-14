import styled from 'styled-components';
import SortBy from "../../ui/SortBy.jsx";
import {guestSort} from "../../data/sort-options.js";
import Search from "../../ui/Search.jsx";
import {guestFilter} from "../../data/filter-options.js";

const TableOperations = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

export default function GuestPanel(){
    return (
        <TableOperations>
            <Search options={guestFilter}/>
            <SortBy options={guestSort}/>
        </TableOperations>
    );
}
