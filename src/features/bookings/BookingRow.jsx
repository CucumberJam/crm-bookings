import {useNavigate} from "react-router-dom";
import useCheckout from "../check-in-out/hooks/useCheckout.js";

import { format, isToday } from "date-fns";
import { formatCurrency } from "../../utils/helpers.js";
import { formatDistanceFromNow } from "../../utils/helpers.js";

import styled from "styled-components";
import Tag from "../../ui/Tag.jsx";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";


import {HiArrowDownOnSquare, HiArrowUpOnSquare, HiEye, HiTrash} from "react-icons/hi2";
import Modal from "../../ui/ModalCompound.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import useDeleteBooking from "./hooks/useDeleteBooking.js";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;
const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

export default function BookingRow({
    booking: {
        id: bookingId,
        startDate,
        endDate,
        numNights,
        totalPrice,
        status,
        guests: { fullName: guestName, email },
        cabins: { name: cabinName },
    },
}) {
    const {checkout, isCheckingOut} = useCheckout();
    const navigate = useNavigate();
    const {isDeleting, deleteBooking} = useDeleteBooking();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    return (
    <Table.Row>
        <Cabin>{cabinName}</Cabin>

        <Stacked>
            <span>{guestName}</span>
            <span>{email}</span>
        </Stacked>

        <Stacked>
            <span>
              {isToday(new Date(startDate))
                ? "Today"
                : formatDistanceFromNow(startDate)}{" "}
              &rarr; {numNights} night stay
            </span>
            <span>
              {format(new Date(startDate), "dd MMM yyyy")} &mdash;{" "}
              {format(new Date(endDate), "dd MMM yyyy")}
            </span>
        </Stacked>

        <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

        <Amount>{formatCurrency(totalPrice)}</Amount>
        <Modal>
            <Menus.Menu>
                <Menus.Toggle id={bookingId}/>
                <Menus.List id={bookingId}>
                    <Menus.Button icon={<HiEye/>}
                                  onClick={()=> navigate(`/bookings/${bookingId}`)}>
                        See details
                    </Menus.Button>
                    {status === 'unconfirmed' && (
                        <Menus.Button icon={<HiArrowDownOnSquare/>}
                                   onClick={() => navigate(`/checkin/${bookingId}`)}>
                        Check in
                    </Menus.Button>)}

                    {(status === 'checked-in' && isToday(new Date(endDate))) &&(
                        <Menus.Button icon={<HiArrowUpOnSquare/>}
                                      disabled={isCheckingOut}
                                      onClick={() => checkout(bookingId)}>
                        Check out
                    </Menus.Button>)}
                    <Modal.Open opens='delete'>
                        <Menus.Button icon={<HiTrash/>}>
                            Delete
                        </Menus.Button>
                    </Modal.Open>
                </Menus.List>
                <Modal.Window name='delete'>
                    <ConfirmDelete resourceName={`Booking № ${bookingId}`}
                                   disabled={isDeleting}
                                   onConfirm={()=> deleteBooking(bookingId)}/>
                </Modal.Window>
        </Menus.Menu>
        </Modal>
    </Table.Row>
    );
}
