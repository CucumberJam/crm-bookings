import Heading from "../ui/Heading";
import Row from "../ui/Row";
import GuestTable from "../features/guests/GuestTable.jsx";
import AddGuest from "../features/guests/AddGuest.jsx";
import GuestPanel from "../features/guests/GuestPanel.jsx";

function Guests() {
  return (
      <>
        <Row type="horizontal">
          <Heading as="h1">All Guests</Heading>
          <AddGuest/>
          <GuestPanel/>
        </Row>
        <GuestTable/>
      </>
  );
}

export default Guests;
