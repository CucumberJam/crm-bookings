import useGetSettings from "./hooks/useGetSettings.js";
import useUpdateSetting from "./hooks/useUpdateSetting.js";
import Form from '../../ui/Form.jsx';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from "../../ui/Spinner.jsx";

function UpdateSettingsForm() {
    const {isLoading, error, settings: {
        minBookingLength,
        maxBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
        fineForEarlyDepart
    } = {}} = useGetSettings();
    const {isUpdating, updateSetting} = useUpdateSetting();
    function handleUpdate(e, name){
        e.preventDefault();
        const { value } = e.target;
        if(!value) return;
        updateSetting({ [name]: value });
    }

    if(error) return <span>{error.message}</span>
    if(isLoading) return <Spinner/>
    return (
    <Form>
        <FormRow label='Minimum nights/booking'>
            <Input type='number' id='min-nights'
                   disabled={isUpdating}
                   defaultValue={minBookingLength}
                   onBlur={e => handleUpdate(e, 'minBookingLength')}/>
        </FormRow>
        <FormRow label='Maximum nights/booking'>
            <Input type='number' id='max-nights'
                   disabled={isUpdating}
                   defaultValue={maxBookingLength}
                   onBlur={e => handleUpdate(e, 'maxBookingLength')}/>
        </FormRow>
        <FormRow label='Maximum guests/booking'>
            <Input type='number' id='max-guests'
                   disabled={isUpdating}
                   defaultValue={maxGuestsPerBooking}
                   onBlur={e => handleUpdate(e, 'maxGuestsPerBooking')}/>
        </FormRow>
        <FormRow label='Breakfast price'>
            <Input type='number' id='breakfast-price'
                   disabled={isUpdating}
                   defaultValue={breakfastPrice}
                   onBlur={e => handleUpdate(e, 'breakfastPrice')}/>
        </FormRow>
        <FormRow label='Fine for early depart % (from money to be returned)'>
            <Input type='number' id='fine-for-early-depart'
                   disabled={isUpdating}
                   defaultValue={fineForEarlyDepart}
                   onBlur={e => handleUpdate(e, 'fineForEarlyDepart')}/>
        </FormRow>
    </Form>
    );
}
export default UpdateSettingsForm;
