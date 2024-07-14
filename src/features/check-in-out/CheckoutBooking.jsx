import {useState} from "react";
import useGetBooking from "../bookings/hooks/useGetBooking.js";
import { useMoveBack } from "../../hooks/useMoveBack.js";
import useCheckoutWithRefund from "./hooks/useCheckoutWithRefund.js";
import useGetSettings from "../settings/hooks/useGetSettings.js";

import styled from "styled-components";
import BookingRefundBox from "../bookings/BookingRefundBox.jsx";
import Checkbox from "../../ui/Checkbox.jsx";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Button from "../../ui/Button.jsx";
import ButtonText from "../../ui/ButtonText.jsx";
import Spinner from "../../ui/Spinner.jsx";
import {formatCurrency, getToday, subtractDates} from "../../utils/helpers.js";


const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckoutBooking() {
    const [confirmRefund, setConfirmRefund] = useState(false);
    const {booking, isLoading} = useGetBooking();
    const {isLoading: isLoadingSettings, settings} = useGetSettings();

    const moveBack = useMoveBack();
    const {checkoutWithRefund, isCheckingOutWithRefund} = useCheckoutWithRefund();

    const {
        id: bookingId ,
        startDate,
        guests,
        totalPrice,
        cabinPrice,
        numNights,
        extrasPrice
    } = booking ? booking : {status: 'unconfirmed', id: 0};

    const today = getToday();
    const factRestNights = subtractDates(today,startDate);
    const refundBeforeFine = totalPrice - totalPrice/numNights * factRestNights;
    const fine = settings?.fineForEarlyDepart/100 * refundBeforeFine;
    const newExtraPrice = extrasPrice === 0 ? fine : extrasPrice/numNights * factRestNights + fine;
    const totalPriceAfterRefund = cabinPrice/numNights * factRestNights + newExtraPrice;
    const totalRefund = totalPrice - totalPriceAfterRefund;
    const params = {today, factRestNights, refundBeforeFine, fineForEarlyDepart: settings?.fineForEarlyDepart, fine, newExtraPrice,totalRefund, totalPriceAfterRefund}
    function handleCheckout() {
        if(!confirmRefund) return;

        if(confirmRefund){
            const refund = {
                endDate: today,
                extrasPrice: newExtraPrice,
                cabinPrice: cabinPrice/numNights * factRestNights,
                totalPrice: cabinPrice/numNights * factRestNights + newExtraPrice,
                numNights: factRestNights
            }
            checkoutWithRefund({bookingId, refund});
        }
    }

    if(isLoading || isLoadingSettings) return <Spinner/>
    return (
        <>
          <Row type="horizontal">
            <Heading as="h1">Check out booking #{bookingId || ''}</Heading>
            <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
          </Row>

          <BookingRefundBox booking={booking} params={params}/>

          <Box>
              <Checkbox id='confirm'
                        checked={confirmRefund}
                        disabled={confirmRefund || isCheckingOutWithRefund}
                        onChange={()=> setConfirmRefund(refund => !refund)}>
                 {guests.fullName} has agreed with fine for early depart and total refund {formatCurrency(totalRefund)} was returned
              </Checkbox>
          </Box>

          <ButtonGroup>
            <Button
                disabled={!confirmRefund || isCheckingOutWithRefund}
                onClick={handleCheckout}>
                Check out booking #{bookingId || ''} before depart
            </Button>
            <Button variation="secondary" onClick={moveBack}>
              Back
            </Button>
          </ButtonGroup>
        </>
    );
}

export default CheckoutBooking;
