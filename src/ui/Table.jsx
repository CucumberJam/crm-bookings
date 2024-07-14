import styled from "styled-components";
import {createContext, useContext} from "react";
import PropTypes from "prop-types";

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;
const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;
const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;
const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;
const StyledBody = styled.section`
  margin: 0.4rem 0;
`;
const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;
const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext('');

// eslint-disable-next-line react/prop-types
function Table({columns, children}){
    return (
        <TableContext.Provider value={{ columns }}>
            <StyledTable role='table'>{children}</StyledTable>
        </TableContext.Provider>
    );
}
// eslint-disable-next-line react/prop-types
function Header({children}){
    const { columns } = useContext(TableContext);
    return (
        <StyledHeader role='row' $columns={columns} as='header'>
            {children}
        </StyledHeader>
    );
}

// eslint-disable-next-line react/prop-types,react/display-name
function Body({data, render}){
    // eslint-disable-next-line react/prop-types
    if(!data.length) return <Empty>No data</Empty>
    return (
        <StyledBody>
            {/* eslint-disable-next-line react/prop-types */}
            {data.map(render)}
        </StyledBody>
    );
}
Body.prototype = {
    data: PropTypes.array,
    render: PropTypes.func
}

// eslint-disable-next-line react/prop-types
function Row({children}){
    const {columns} = useContext(TableContext);
    return (
        <StyledRow role='row' $columns={columns}>
            {children}
        </StyledRow>
    );
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

Table.prototype = {
    columns: PropTypes.string,
    children: PropTypes.element
}
export default Table;