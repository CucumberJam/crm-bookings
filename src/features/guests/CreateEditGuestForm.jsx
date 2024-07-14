import {useForm} from "react-hook-form";

import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form.jsx";
import FormRow from '../../ui/FormRow';
import Button from "../../ui/Button.jsx";
import PropTypes from "prop-types";
import {useCreateGuest} from "./hooks/useCreateGuest.js";
import useUpdateGuest from "./hooks/useUpdateGuest.js";
import {useGetNationalities} from "./hooks/useGetNationalities.js";


const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
    props.$type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;
function CreateEditGuestForm({guestToBeEdit, onCloseModal}) {

    const editId = guestToBeEdit?.id ? guestToBeEdit.id : false;
    const editValues = guestToBeEdit?.id ? guestToBeEdit : null;
    const isEditSession = Boolean(editId);

    const {register,
      handleSubmit,
      reset,
      formState: {errors}}
        = useForm({
      defaultValues: isEditSession ? editValues : {}
    });
    const {isCreating, createGuest} = useCreateGuest();
    const {isUpdating, updateGuest} = useUpdateGuest();
    const { isLoading: isLoadingNationalities, nationalities } = useGetNationalities();

    const isWorking = isCreating || isUpdating || isLoadingNationalities;
    function onSubmit(data){
        const nationality = data.nationality;
        const countryFlag = `https://flagcdn.com/${nationalities[data.nationality]}.svg`

        const updatedGuest = {...data, nationality, countryFlag};

        if(isEditSession) updateGuest({updatedGuest, id: editId},
            {onSuccess: ()=> {
                reset();
                onCloseModal?.();
            }});
        else createGuest(updatedGuest, {
            onSuccess: ()=> {
                reset();
                onCloseModal?.();
            }});
        }

    return (
    <Form onSubmit={handleSubmit(onSubmit)}
          type='modal'>

        <FormRow label="Full name" error={errors?.fullName?.message}>
            <Input type="text" id="fullName"
                   disabled={isWorking}
                   {...register('fullName', {
                       required: 'This field is required'
                   })}/>
        </FormRow>

        <FormRow label="National id number" error={errors?.nationalID?.message}>
            <Input type="text" id="nationalID"
                   disabled={isWorking}
                   {...register('nationalID', {
                       required: 'This field is required',
                       minLength: {
                           value: 6,
                           message: 'National id number needs a minimum of 6 characters'
                       },
                       maxLength: {
                           value: 10,
                           message: 'National id number needs a maximum of 10 characters'
                       }
                   })}/>
        </FormRow>

        <FormRow label='Nationality' error={errors?.nationality?.message}>
            <StyledSelect disabled={isWorking}
                          id="nationality"
                          {...register('nationality', {
                              required: 'This field is required',
                          })}>
                {Object.keys(nationalities).map(option => (
                    <option key={option}
                            value={option}>
                        {option}
                    </option>
                ))}
            </StyledSelect>
        </FormRow>

        <FormRow label="Email address" rror={errors?.email?.message}>
            <Input type="email" id="email"
                   disabled={isWorking}
                   {...register('email', {
                       required: 'This field is required',
                       pattern: {
                           value: /\S+@\S+\.\S+/,
                           message: 'Please provide a valid email address'
                       }})}/>
        </FormRow>
        <FormRow label="Phone number" error={errors?.phone?.message}>
            <Input type="tel" id="phone"
                   disabled={isWorking}
                   placeholder={!isEditSession && '7(123)456-7890'}
                   {...register('phone', {
                       required: 'This field is required',
                       pattern: {
                           value: /[0-9][- ]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
                           message: 'Please provide a valid phone number'
                       }
                   })}/>
        </FormRow>
      <FormRow>
        <Button variation="secondary"
                type="reset"
                onClick={()=> onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>
          { isEditSession ? 'Edit Guest' : 'Create new Guest'}
        </Button>
      </FormRow>
    </Form>
  );
}
CreateEditGuestForm.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func
}
CreateEditGuestForm.defaultProps = {}
export default CreateEditGuestForm;
