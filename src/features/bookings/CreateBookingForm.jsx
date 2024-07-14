import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {useGetGuestsForBooking} from "../guests/hooks/useGetGuestsForBooking.js";
import useGetSettings from "../settings/hooks/useGetSettings.js";
import {useCreateBooking} from "./hooks/useCreateBooking.js";
import { differenceInDays, isBefore, isDate, startOfToday } from 'date-fns';
import toast from 'react-hot-toast';

import styled from 'styled-components';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import Checkbox from '../../ui/Checkbox';
import Button from '../../ui/Button';
import CabinsAvailable from "../cabins/CabinsAvailable.jsx";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;
const ButtonContainer = styled.div`
  display: flex; 
  gap: 5px; 
  margin: 0 auto;
`

export default function CreateBookingForm({onCloseModal}) {
    const [wantsBreakfast, setWantsBreakfast] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [findCabins, setFindCabins] = useState(false);
    const [chosenCabin, setChosenCabin] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const { guests, isLoading: isLoadingGuests } = useGetGuestsForBooking();
    const { settings, isLoading: isLoadingSettings } = useGetSettings();
    const { createBooking, isLoading: isCreating } = useCreateBooking();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset
    } = useForm();

    if (isLoadingSettings || isLoadingGuests) return <Spinner />;
    function onSubmit(data) {
        const checked = checkDates(data.startDate, data.endDate);
        if(!checked.success) {
            toast.error(checked.message);
            return;
        }
        const numNights = checked.numNights;
        const cabinPrice = (chosenCabin.regularPrice - chosenCabin.discount) * numNights;

        const extrasPrice = wantsBreakfast  ? settings.breakfastPrice * numNights * data.numGuests : 0;
        const totalPrice = cabinPrice + extrasPrice;

        const finalData = {
            ...data,
            cabinPrice,
            extrasPrice,
            totalPrice,
            isPaid,
            numNights,
            cabinId: Number(chosenCabin.id), //Number(data.cabinId),
            numGuests: Number(data.numGuests),
            guestId: Number(data.guestId),
            hasBreakfast: wantsBreakfast,
            status: 'unconfirmed',
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
        };
        createBooking(finalData, {
            onSettled : (data) => {
                navigate(`/bookings`);
                reset();
                setFindCabins(false);
                onCloseModal?.();
            }
        });
    }

    function handleReset() {
        setWantsBreakfast(false);
        setIsPaid(false);
        onCloseModal();
    }
    function checkDates(startDate, endDate ){
        if(startDate?.type === 'click' || startDate === ''){
            return {success: false, message: 'You must choose a valid start-date'};
        }
        if(endDate?.type === 'click' || endDate === ''){
            return {success: false, message: 'You must choose a valid end-date'};
        }

        const numNights = differenceInDays(
            new Date(endDate),
            new Date(startDate)
        );
        const today = startOfToday();

        if (numNights < 1) {
            return {success: false, message: 'Start date must be before end date'};
        }
        if (numNights < settings.minBookingLength) {
            return {success: false, message: `Minimum nights per booking are ${settings.minBookingLength}`};
        }
        if (numNights > settings.maxBookingLength) {
            return {success: false, message: `Maximum nights per booking are ${settings.maxBookingLength}`};
        }
        if (isBefore(new Date(startDate), today)) {
            return {success: false, message: "You can't start a booking before today"};
        }
        return {success: true, numNights, startDate, endDate};
    }
    function getAvailableCabins(){
        const checked = checkDates(getValues().startDate, getValues().endDate);
        if(!checked.success) {
            toast.error(checked.message);
            return;
        }
        setStartDate(checked.startDate);
        setEndDate(checked.endDate);
        setFindCabins(true);
    }
    function choseCabin(chosenCabin){
        setChosenCabin({...chosenCabin});
    }
    return (
        <Form onSubmit={handleSubmit(onSubmit)}
              type='modal'>
            <FormRow label="Start date" error={errors?.startDate?.message}>
                <Input
                    disabled={isCreating}
                    type="date"
                    id="startDate"
                    {...register('startDate', {
                        required: 'This field is required',
                        validate:
                            isDate(getValues().startDate) || 'You must choose a valid date',
                    })}/>
            </FormRow>
            <FormRow label="End date" error={errors?.endDate?.message}>
                <>
                    <Input
                        disabled={isCreating}
                        type="date"
                        id="endDate"
                        {...register('endDate', {
                            required: 'This field is required',
                            validate:
                                isDate(getValues().endDate) || 'You must choose a valid date',
                        })}/>
                    <ButtonContainer>
                        <Button as='p'
                                onClick={getAvailableCabins}>
                            Get available cabins
                        </Button>
                    </ButtonContainer>
                </>
            </FormRow>
            <FormRow label="Number of guests" error={errors?.numGuests?.message}>
                    <Input
                    disabled={isCreating}
                    type="number"
                    min={1}
                    defaultValue={1}
                    id="numGuests"
                    {...register('numGuests', {
                        required: 'This field is required',
                        min: {
                            value: 1,
                            message: 'Minimum number of guests must be 1',
                        },
                        max: {
                            value: settings.maxGuestsPerBooking,
                            message: `Max number of guests must be ${settings.maxGuestsPerBooking}`,
                        },
                    })}/>
            </FormRow>
            <FormRow label="Select cabin">
{/*                <StyledSelect
                    disabled={isCreating || !findCabins}
                    id="cabinId"
                    {...register('cabinId')}>
                    {cabins.sort((a,b)=> a.name - b.name).map((cabin) => (
                        <option key={cabin.id} value={cabin.id}>
                            {cabin.name}
                        </option>
                    ))}
                </StyledSelect>*/}
                {!findCabins ?  <StyledSelect
                    disabled={isCreating || !findCabins}
                    id="cabinId"
                    {...register('cabinId')}>
                    <option>001</option>
                </StyledSelect> :
                <CabinsAvailable
                                 startDate={startDate}
                                 endDate={endDate}
                                 onChange={choseCabin}/>}
            </FormRow>
            <FormRow label="Select guest">
                <>
                    <StyledSelect
                        disabled={isCreating}
                        id="guestId"
                        {...register('guestId')}>
                        {guests.map((guest) => (
                            <option key={guest.id} value={guest.id}>
                                {guest.fullName}
                            </option>
                        ))}
                    </StyledSelect>
                    <ButtonContainer>
                        <Button as='p' onClick={() => navigate(`/guests`)}>
                            Create new Guest
                        </Button>
                    </ButtonContainer>
                </>
            </FormRow>

            <FormRow label="Further observations">
                <Input
                    type="text"
                    id="observations"
                    disabled={isCreating}
                    {...register('observations')}
                />
            </FormRow>
            <FormRow>
                <Checkbox
                    id="breakfast"
                    onChange={() => setWantsBreakfast((e) => !e)}
                    disabled={isCreating}>
                    I want breakfast with my booking
                </Checkbox>
            </FormRow>
            <FormRow>
                <Checkbox
                        id="paid" disabled={isCreating}
                        onChange={() => setIsPaid((e) => !e)}>
                    This booking is paid
                </Checkbox>
            </FormRow>
            <FormRow>
                <Button type="submit" variation="primary" disabled={isCreating}>
                    Submit
                </Button>
                <Button type="reset"
                        variation="secondary"
                        disabled={isCreating}
                        onClick={handleReset}>
                    Cancel
                </Button>
            </FormRow>
        </Form>
    );
}
