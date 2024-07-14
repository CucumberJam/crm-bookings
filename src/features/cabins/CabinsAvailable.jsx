import styled from "styled-components";
import useGetCabinsFreeFromBookings from "./hooks/useGetCabinsFreeFromBookings.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import {useState} from "react";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;
const CenteredBox = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`
export default function CabinsAvailable({startDate, endDate, onChange,}){
    const [chosen, setChosen] = useState('000');
    const {isLoading, cabins} = useGetCabinsFreeFromBookings({startDate, endDate});

    function pickUp(event){
        setChosen(event.target.value);
        const found = cabins.find(el => el.id === +event.target.value);
        onChange(found);
    }

    if (isLoading) return <CenteredBox><SpinnerMini/></CenteredBox>;
    if(!isLoading && cabins.length === 0) return <CenteredBox><span>No available cabins</span></CenteredBox>
    return (
            <StyledSelect
                disabled={isLoading}
                id="cabinId" type='text'
                value={chosen}
                onChange={pickUp}>
                {cabins?.sort((a,b)=> a.name - b.name).map((cabin) => (
                    <option key={cabin.id} value={cabin.id}>
                        {cabin.name}
                    </option>
                ))}
            </StyledSelect>
    );
}