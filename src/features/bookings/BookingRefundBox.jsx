import styled from "styled-components";
import { format } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineCalculator, HiOutlineHandThumbUp
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem.jsx";
import { Flag } from "../../ui/Flag.jsx";

import {formatCurrency} from "../../utils/helpers.js";
import {HiOutlineCreditCard, HiScissors} from "react-icons/hi";

const StyledBookingDataBox = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-blue-700);
  padding: 1.5rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 2.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 3.2rem;
  border-radius: var(--border-radius-sm);

  background-color: ${(props) =>
      props.$isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(props) =>
      props.$isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }
`;

const Footer = styled.footer`
  padding: 1rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

function BookingRefundBox({ booking, params }) {
  const {
    created_at, startDate, numNights, numGuests, cabinPrice,
    hasBreakfast, observations,totalPrice,extrasPrice,
    guests: { fullName: guestName, email, country, countryFlag, nationalID },
    cabins: { name: cabinName },
  } = booking;

  const {
    today, factRestNights, refundBeforeFine, fineForEarlyDepart, fine,
    newExtraPrice, totalRefund, totalPriceAfterRefund
  } = params;


  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineCalculator />
          <p>Refund for early check out</p>
        </div>

        <p>
          {format(new Date(startDate), "EEE, MMM dd yyyy")}
          &mdash;
          {format(new Date(today), "EEE, MMM dd yyyy")}
        </p>

        <p>
          Total {factRestNights} nights in Cabin <span>{cabinName}</span>
        </p>
      </Header>

      <Section>
        <Guest>
          {countryFlag && <Flag src={countryFlag} alt={`Flag of ${country}`} />}
          <p>
            {guestName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
          </p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>National ID {nationalID}</p>
        </Guest>

        {observations && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Observations">
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast ? "Yes" : "No"}
        </DataItem>

        <DataItem icon={<HiScissors />}  label="Fine of money needs to be refunded:">
         {fineForEarlyDepart} % = {formatCurrency(fine)}
        </DataItem>

        <DataItem icon={<HiOutlineCreditCard />}  label="Refund before fine:">
         {formatCurrency(refundBeforeFine)}
        </DataItem>

        <Price $isPaid={true}>
          <DataItem icon={<HiOutlineCurrencyDollar />}
                    label={`Total price before refund:`}>
            {formatCurrency(totalPrice) + ' '}

            {hasBreakfast &&
                ` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                    extrasPrice
                )} breakfast) `}
             for {numNights} nights
          </DataItem>

          <p>Paid</p>
        </Price>

        <Price $isPaid={true}>
          <DataItem icon={<HiOutlineCurrencyDollar />}
                    label={`Total price after refund:`}>
            {formatCurrency(totalPriceAfterRefund)}

            {` (${formatCurrency(cabinPrice/numNights * factRestNights)} cabin + ${formatCurrency(
                  newExtraPrice)} ${hasBreakfast ? 
                `extras: ${formatCurrency(newExtraPrice - fine)} breakfast & ${formatCurrency( fine)} fine)` : 
                'fine'} for ${factRestNights} nights`}
          </DataItem>
        </Price>

        <Price $isPaid={false}>
          <DataItem icon={<HiOutlineHandThumbUp />}
          label="Total refund:">
            {formatCurrency(totalRefund)} ({formatCurrency(totalPrice)} total price before fine - {formatCurrency(totalPriceAfterRefund)} total price after fine)
          </DataItem>
        </Price>
      </Section>

      <Footer>
        <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingRefundBox;
