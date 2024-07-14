import useGetBookings from "./hooks/useGetBookings.js";
import {useCallback} from "react";

import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";
import Empty from "../../ui/Empty.jsx";
import Spinner from "../../ui/Spinner.jsx";
import Pagination from "../../ui/Pagination.jsx";
import BookingRow from "./BookingRow.jsx";

function BookingTable() {
  const {isLoading, status, bookings, count} = useGetBookings();
  const renderBookings = useCallback((booking) => <BookingRow key={booking?.id} booking={booking}/>, []);

  if(isLoading) return <Spinner/>
  if(!bookings.length) return <Empty resource='Bookings'/>
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        {status === 'success' && <Table.Body
            data={bookings}
            render={renderBookings}/>}

        <Table.Footer>
          <Pagination count={count}/>
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
