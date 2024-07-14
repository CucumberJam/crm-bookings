import {useNavigate} from "react-router-dom";
import { format } from "date-fns";

import styled from "styled-components";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";


import {HiEye, HiPencil} from "react-icons/hi2";
import Modal from "../../ui/ModalCompound.jsx";
import CreateEditGuestForm from "./CreateEditGuestForm.jsx";


const FullName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-weight: 500;
`;
const Cursiv=styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 20px;
  gap: 0.2rem;
  color: var(--color-grey-500);
  font-size: 1.2rem;
`

export default function GuestRow({ guest }) {
    const {id: guestId, fullName, email, created_at, nationalID} = guest;

    const navigate = useNavigate();


    return (
    <Table.Row>
        <FullName>{fullName}</FullName>
        <Stacked>{email}</Stacked>
        <Cursiv>{format(new Date(created_at), "dd MMM yyyy")}</Cursiv>
        <Stacked>{nationalID}</Stacked>
        <Cursiv>{guest.phone ? guest.phone : '...'}</Cursiv>
        <Modal>
            <Menus.Menu>
                <Menus.Toggle id={guestId}/>
                <Menus.List id={guestId}>
                    <Menus.Button icon={<HiEye/>}
                                  onClick={()=> navigate(`/guests/${guestId}`)}>
                        See details
                    </Menus.Button>

                    <Modal.Open opens='edit'>
                        <Menus.Button icon={<HiPencil/>}>
                            Edit
                        </Menus.Button>
                    </Modal.Open>

                </Menus.List>
                <Modal.Window name='edit'>
                    <CreateEditGuestForm guestToBeEdit={guest}/>
                </Modal.Window>
        </Menus.Menu>
        </Modal>
    </Table.Row>
    );
}
