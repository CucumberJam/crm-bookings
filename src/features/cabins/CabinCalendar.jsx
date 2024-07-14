import useGetBookingsByCabinIdWithDate from "../bookings/hooks/useGetBookingsByCabinIdWithDate.js";
import Spinner from "../../ui/Spinner.jsx";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMemo, useState} from "react";
import {getDates} from "../../utils/helpers.js";
import styled from "styled-components";
import styles from "./CabinCalendar.module.css";
import toast from "react-hot-toast";

const StyledBox = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`
export default function CabinCalendar({date, cabinId}){
    const [selected, setSelected] = useState(new Date());

    let {isLoading, bookings} = useGetBookingsByCabinIdWithDate({date, cabinId});

    const bookedDays = useMemo(()=>{
        if(!bookings) return [];
        let booked = [];
        bookings.forEach(booking => {
            const dates = getDates(new Date(booking.startDate),  new Date(booking.endDate));
            booked = booked.concat(dates);
        });
        return [...new Set(booked)];
    }, [bookings])

    function handleDayClick(day, { booked }){
        if(booked){
            toast.error(`Day ${day.toLocaleDateString()} is booked`);
        } else{
            toast.success(`Day ${day.toLocaleDateString()} is available`);
        }
    }

    if(isLoading) return <Spinner/>
    return  (
            <StyledBox>
                <DayPicker disableNavigation
                           selected={selected}
                    onSelect={setSelected}
                    defaultMonth={new Date(date.getFullYear(), date.getMonth())}
                    modifiers={{ booked: bookedDays }}
                    modifiersClassNames={{ booked: styles.booked }}
                    onDayClick={handleDayClick}/>
            </StyledBox>
    );
}