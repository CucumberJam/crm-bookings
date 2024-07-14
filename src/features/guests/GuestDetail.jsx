import { useMoveBack } from "../../hooks/useMoveBack.js";
import {useSearchParams} from "react-router-dom";
import useGetGuest from "./hooks/useGetGuest.js";
import useGetBookings from "../bookings/hooks/useGetBookings.js";

import {format} from "date-fns";
import {formatCurrency, getToday} from "../../utils/helpers.js";

import {bookingFilter} from "../../data/filter-options.js";

import BookingTable from "../bookings/BookingTable.jsx";

import styled from "styled-components";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonText from "../../ui/ButtonText.jsx";
import Spinner from "../../ui/Spinner.jsx";
import DataItem from "../../ui/DataItem.jsx";
import Empty from "../../ui/Empty.jsx";
import {Flag} from "../../ui/Flag.jsx";
import Filter from "../../ui/Filter.jsx";

import {HiOutlineCurrencyDollar, } from "react-icons/hi2";
import Tag from "../../ui/Tag.jsx";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
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
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

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

function GuestDetail() {
    const {isLoading, guest, guestId} = useGetGuest();
    const { created_at, fullName, email, countryFlag, nationalID, phone} = guest ? guest
        : {created_at: getToday(), fullName: '', email: '', countryFlag: '', nationalID: '', phone: ''};
    const {isLoading: isBookingLoading, bookings} = useGetBookings();
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get('status');
    const totalPrice = bookings?.length > 0 ? bookings.reduce((acc, cur)=> acc + cur.totalPrice, 0) : 0;
    const isPaid = !!(filterValue && filterValue === 'checked-out' && totalPrice > 0);

    const moveBack = useMoveBack();

    if(isLoading || isBookingLoading) return <Spinner/>
    if(!guest) return <Empty resource={`Guest with №${guestId}`}/>
    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                  <Heading as="h1">{fullName}</Heading>
                    <Tag type='green'>Registered: {format(new Date(created_at), "EEE, MMM dd yyyy")}</Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>
            <Row type="horizontal">
                <Guest>
                    {countryFlag && <Flag src={countryFlag} alt={`Flag`} />}
                    <span>&bull;</span>
                    <p>{email}</p>
                    <span>&bull;</span>
                    <p>National ID {nationalID}</p>
                    <span>&bull;</span>
                    {phone && <p>Phone number: {phone}</p>}
                </Guest>
                <Filter filterField='status'
                        options={bookingFilter}/>
            </Row>
            <BookingTable/>
            <Price $isPaid={isPaid}>
                <DataItem icon={<HiOutlineCurrencyDollar />}
                          label={`Total price`}>
                    {formatCurrency(totalPrice)}
                </DataItem>
            </Price>
        </>
    );
}

export default GuestDetail;
