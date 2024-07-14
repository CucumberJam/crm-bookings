import styled from "styled-components";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from "react-icons/hi2";
import DataItem from "../../ui/DataItem.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import Carousel from "../../ui/Carousel.jsx";
import Image from "../../ui/Image.jsx";
import Modal from "../../ui/ModalCompound.jsx";
import Button from "../../ui/Button.jsx";
import CabinCalendar from "./CabinCalendar.jsx";
import {useState} from "react";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Select from "../../ui/Select.jsx";
import Row from "../../ui/Row.js";

const StyledBookingDataBox = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;
const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  margin-bottom: 1rem;
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
  padding: 2rem 2rem 1.2rem;
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

function CabinDataBox({ cabinId, cabin }) {
  const today = new Date();
  const months = [{label: 'january', value: 0}, {label:'february', value: 1}, {label:'march', value: 2}, {label:'april', value: 3},  {label:'may', value: 4}, {label:'june', value: 5}, {label:'july', value: 6}, {label:'august', value: 7}, {label:'september', value: 8}, {label:'october', value: 9},  {label:'november', value: 10},   {label: 'december', value: 11}]
  const years = [{label: today.getFullYear() - 1, value: today.getFullYear() - 1}, {label: today.getFullYear(), value: today.getFullYear()}, {label: today.getFullYear()+1, value: today.getFullYear()+1}]
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(months[today.getMonth()].label);
  const [year, setYear] = useState(today.getFullYear());

  function changeDate(dateObj){
    let foundMonth = date.getMonth();
    let foundYear = date.getFullYear();
    if(dateObj.month){
      foundMonth = months.find(el => el.value === +dateObj.month);
      setMonth(prev => foundMonth.label);
      foundMonth = foundMonth.value;
    }else{
      foundYear = years.find(el => el.label === dateObj.year);
      setYear(prev => foundYear.label);
      foundYear = foundYear.value;
    }
    setDate(prev => new Date(foundYear, foundMonth, today.getDate()));
  }

  const {maxCapacity, regularPrice, discount, description, image, images,
  } = cabin ? cabin :  {name: '', maxCapacity: 0, regularPrice: 0, discount: 0, description: '', image: '', images: []};

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineHomeModern />
          <p>
            {maxCapacity} maximum capacity of Cabin
          </p>
        </div>
      </Header>
      <Row type='horizontal' style={{justifyContent: 'flex-end', gap: '10px'}}>
        <Select value={year}
                options={years}
                onChange={event => changeDate({year: event.target.value})}/>
        <Select value={month}
                options={months}
                onChange={event => changeDate({month: event.target.value})}/>
        <Modal>
          <Modal.Open opens='cabin-calendar'>
            <ButtonGroup style={{paddingRight: '15px'}}>
              <Button>Check bookings</Button>
            </ButtonGroup>
          </Modal.Open>
          <Modal.Window name='cabin-calendar'>
            <CabinCalendar date={date}
                           cabinId={+cabinId}/>
          </Modal.Window>
        </Modal>
      </Row>

      <Section>
        {JSON.parse(images)?.length > 1? <Carousel images={JSON.parse(images)}/> :
            <Image src={image} alt='photo' key={image} width='300px'/>}

        {description && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Description">
            {description}
          </DataItem>
        )}
        <Price $isPaid={true}>
          <DataItem icon={<HiOutlineCurrencyDollar />}
                    label={`Regular price`}>
            {formatCurrency(regularPrice)} / night
          </DataItem>

          <p>Discount: {formatCurrency(discount)}</p>
        </Price>
      </Section>
    </StyledBookingDataBox>
  );
}

export default CabinDataBox;
