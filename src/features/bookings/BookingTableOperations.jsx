import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter.jsx";
import TableOperations from "../../ui/TablePanel.jsx";
import {bookingsOptions} from "../../data/sort-options.js";
import {bookingOptions} from "../../data/filter-options.js";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={bookingOptions}/>

      <SortBy
        options={bookingsOptions}/>
    </TableOperations>
  );
}

export default BookingTableOperations;
