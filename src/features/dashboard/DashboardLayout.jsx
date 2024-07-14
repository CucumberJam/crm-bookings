import styled from "styled-components";
import useRecentBookings from "./hooks/useRecentBookings.js";
import Spinner from "../../ui/Spinner.jsx";
import useRecentStays from "./hooks/useRecentStays.js";
import Stats from "./Stats.jsx";
import useGetCabins from "../cabins/hooks/useGetCabins.js";
import SalesChart from "./SalesChart.jsx";
import DurationChart from "./DurationChart.jsx";
import TodayActivity from "../check-in-out/TodayActivity.jsx";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;
export default function DashboardLayout(){
    const {isLoading: isRecentBookingsLoading,
        bookings} = useRecentBookings();
    const {isLoading: isRecentStaysLoading,
        confirmedStays, numDays} = useRecentStays();
    const {cabins, isLoading: isCabinsLoading} = useGetCabins();


    if(isRecentBookingsLoading || isRecentStaysLoading || isCabinsLoading)
        return <Spinner/>;

    return (
        <StyledDashboardLayout>
            <Stats bookings={bookings}
                   confirmedStays={confirmedStays}
                   numDays={numDays}
                   cabinCount={cabins.length || 0}/>
            <TodayActivity/>
            <DurationChart confirmedStays={confirmedStays}/>
            <SalesChart bookings={bookings} numDays={numDays}/>
        </StyledDashboardLayout>
    );
}