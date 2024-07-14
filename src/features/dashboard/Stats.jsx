import Stat from "./Stat.jsx";
import {HiOutlineBanknotes, HiOutlineChartBar,
    HiOutlineBriefcase, HiOutlineCalendarDays} from "react-icons/hi2";
import {formatCurrency} from "../../utils/helpers.js";


export default function Stats({bookings, confirmedStays, numDays, cabinCount}){

    const numBookings = bookings.length || 0;

    const sales = bookings.reduce((acc, curr)=> acc + curr.totalPrice, 0);

    const checkins = confirmedStays.length || 0;

    const occupation = confirmedStays
        .reduce((acc, curr)=> acc + curr.numNights, 0) / (numDays * cabinCount);

    return (
        <>
            <Stat title='Bookings'
                  color='blue'
                  icon={<HiOutlineBriefcase/>}
                  value={numBookings}/>

            <Stat title='Sales'
                  color='green'
                  icon={<HiOutlineBanknotes/>}
                  value={formatCurrency(sales)}/>

            <Stat title='Check in'
                  color='indigo'
                  icon={<HiOutlineCalendarDays/>}
                  value={checkins}/>

            <Stat title='Occupancy rate'
                  color='yellow'
                  icon={<HiOutlineChartBar/>}
                  value={Math.round(occupation * 100) + '%'}/>
        </>
    );
}