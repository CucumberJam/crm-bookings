import {useEffect, useState} from "react";
import useGetBooking from "../bookings/hooks/useGetBooking.js";
import { useMoveBack } from "../../hooks/useMoveBack.js";
import useCheckin from "./hooks/useCheckin.js";
import useGetSettings from "../settings/hooks/useGetSettings.js";

import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox.jsx";
import Checkbox from "../../ui/Checkbox.jsx";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Button from "../../ui/Button.jsx";
import ButtonText from "../../ui/ButtonText.jsx";
import Spinner from "../../ui/Spinner.jsx";
import {formatCurrency} from "../../utils/helpers.js";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
    const [confirmPaid, setConfirmPaid] = useState(false);
    const [breakfastPaid, setBreakfastPaid] = useState(false);
    const {booking, isLoading} = useGetBooking();
    const {isLoading: isLoadingSettings, settings} = useGetSettings();

    const moveBack = useMoveBack();
    const {checkin, isCheckingIn} = useCheckin();

    useEffect(() => {
        setConfirmPaid(booking?.isPaid || false);
        setBreakfastPaid(booking?.hasBreakfast || false);
    }, [booking?.isPaid, booking?.hasBreakfast]);

    const {
    id: bookingId ,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
    } = booking ? booking : {status: 'unconfirmed', id: 0};

    const optionalBreakfastPrice = settings?.breakfastPrice *
        numNights * numGuests;
    function handleCheckin() {
        if(!confirmPaid) return;
        let breakfast = {};
        if(breakfastPaid){
            breakfast = {
                hasBreakfast: true,
                extrasPrice: optionalBreakfastPrice,
                totalPrice: totalPrice + optionalBreakfastPrice
            }
        }
        checkin({bookingId, breakfast});
    }

    if(isLoading || isLoadingSettings) return <Spinner/>
    return (
        <>
          <Row type="horizontal">
            <Heading as="h1">Check in booking #{bookingId || ''}</Heading>
            <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
          </Row>

          <BookingDataBox booking={booking} />

            {!hasBreakfast && (
                <Box>
                    <Checkbox id='breakfast'
                              checked={breakfastPaid}
                              disabled={breakfastPaid}
                              onChange={() => {
                                  setBreakfastPaid(breakfast => !breakfast)
                                  setConfirmPaid(false);
                              }}>
                        I Need to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
                    </Checkbox>
                </Box>
            )}

          <Box>
              <Checkbox id='confirm'
                        checked={confirmPaid}
                        disabled={confirmPaid || isCheckingIn}
                        onChange={()=> setConfirmPaid(confirm => !confirm)}>
                  I confirm that {guests.fullName} has paid total amount of {
                  !breakfastPaid ? formatCurrency(totalPrice) :
                      `${formatCurrency(totalPrice + optionalBreakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBreakfastPrice)})` }
              </Checkbox>
          </Box>

          <ButtonGroup>
            <Button
                disabled={!confirmPaid || isCheckingIn}
                onClick={handleCheckin}>
                Check in booking #{bookingId || ''}
            </Button>
            <Button variation="secondary" onClick={moveBack}>
              Back
            </Button>
          </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
