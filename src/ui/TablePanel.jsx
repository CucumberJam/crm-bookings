import styled from 'styled-components';
import Filter from "./Filter.jsx";
import SortBy from "./SortBy.jsx";
import PropTypes from "prop-types";

const TableOperations = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

export default function TablePanel({filterOptions, sortOptions, filterField = 'discount'}){
    return (
        <TableOperations>
            <Filter filterField={filterField}
                    options={filterOptions}/>

            <SortBy options={sortOptions}/>
        </TableOperations>
    );
}
TablePanel.proptype = {
    filterOptions: PropTypes.array.isRequired,
    sortOptions: PropTypes.array.isRequired,
}
