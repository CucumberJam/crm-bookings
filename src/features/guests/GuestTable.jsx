import {useCallback} from "react";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";
import Empty from "../../ui/Empty.jsx";
import Spinner from "../../ui/Spinner.jsx";
import Pagination from "../../ui/Pagination.jsx";
import useGetGuests from "./hooks/useGetGuests.js";
import GuestRow from "./GuestRow.jsx";

function GuestTable() {
  const {isLoading, status, guests, count} = useGetGuests();

  const renderGuests = useCallback((guest) => <GuestRow key={guest?.id} guest={guest}/>, []);

  if(isLoading) return <Spinner/>
  if(!guests.length) return <Empty resource='Guests'/>

  return (
    <Menus>
      <Table columns="2fr 1.5fr 1fr 1.4fr 1.5fr 3.2rem">
        <Table.Header>
          <div>Full Name</div>
          <div>Email</div>
          <div>Date registration</div>
          <div>National ID</div>
          <div>Phone number</div>
          <div></div>
        </Table.Header>

        {status === 'success' && (
            <Table.Body data={guests}
                        render={renderGuests}/>)}

        <Table.Footer>
          <Pagination count={count}/>
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default GuestTable;
