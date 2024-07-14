import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable.jsx";
import TablePanel from "../ui/TablePanel.jsx";
import {bookingFilter} from "../data/filter-options.js";
import {bookingsSort} from "../data/sort-options.js";
import AddBooking from "../features/bookings/AddBooking.jsx";

function Bookings() {
  return (
      <>
        <Row type="horizontal">
          <Heading as="h1">All bookings</Heading>
          <AddBooking/>
          <TablePanel filterOptions={bookingFilter}
                      sortOptions={bookingsSort}
                      filterField='status'/>
        </Row>
        <BookingTable/>
      </>
  );
}

export default Bookings;
