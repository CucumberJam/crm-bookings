import { useMoveBack } from "../../hooks/useMoveBack.js";
import useGetBooking from "./hooks/useGetBooking.js";
import useCheckout from "../check-in-out/hooks/useCheckout.js";
import {useNavigate} from "react-router-dom";
import useDeleteBooking from "./hooks/useDeleteBooking.js";

import styled from "styled-components";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag.jsx";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Button from "../../ui/Button.jsx";
import ButtonText from "../../ui/ButtonText.jsx";
import Spinner from "../../ui/Spinner.jsx";
import BookingDataBox from "./BookingDataBox.jsx";
import {HiArrowUpOnSquare, HiTrash} from "react-icons/hi2";
import {getToday, isTodayBeforeEndDate} from "../../utils/helpers.js";
import Modal from "../../ui/ModalCompound.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import Empty from "../../ui/Empty.jsx";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
    const {bookingId, booking, isLoading} = useGetBooking();
    const { status, endDate} = booking ? booking : {status: 'unconfirmed', endDate: getToday()}

    const {isDeleting, deleteBooking} = useDeleteBooking();
    const navigate = useNavigate();
    const moveBack = useMoveBack();
    const {checkout, isCheckingOut} = useCheckout();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    if(isLoading) return <Spinner/>
    if(!booking) return <Empty resource={`booking with №${bookingId}`}/>
    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                  <Heading as="h1">Booking #{bookingId}</Heading>
                  <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                <Modal>
                    <Modal.Open opens='delete'>
                        <Button icon={<HiTrash/>} variation="danger">
                            Delete
                        </Button>
                    </Modal.Open>
                    <Modal.Window name='delete'>
                        <ConfirmDelete resourceName={`Booking № ${bookingId}`}
                                       disabled={isDeleting}
                                       onConfirm={()=> deleteBooking(bookingId, {
                                           onSettled: () => navigate(-1)
                                       })}/>
                    </Modal.Window>
                </Modal>

                {status === 'unconfirmed' && (
                    <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
                        Check in
                    </Button>
                )}
                {status === 'checked-in' && (
                    isTodayBeforeEndDate(endDate) ?
                        (
                            <Button icon={HiArrowUpOnSquare}
                                    onClick={() => navigate(`/checkout/${bookingId}`)}>
                                Check out
                            </Button>
                        )
                        :
                        (
                            <Button icon={HiArrowUpOnSquare}
                                          disabled={isCheckingOut}
                                          onClick={() => checkout(bookingId)}>
                                Check out
                            </Button>
                        ))}
            </ButtonGroup>
        </>
    );
}

export default BookingDetail;
