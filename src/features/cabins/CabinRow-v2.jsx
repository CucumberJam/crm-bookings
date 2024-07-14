import useDeleteCabin from "./hooks/useDeleteCabin.js";
import styled from "styled-components";
import {formatCurrency} from "../../utils/helpers.js";
import PropTypes from "prop-types";
import CreateEditCabinForm from "./CreateEditCabinForm.jsx";
import {HiSquare2Stack, HiPencil, HiTrash, HiEye} from "react-icons/hi2";
import useCreateCabin from "./hooks/useCreateCabin.js";
import Modal from "../../ui/ModalCompound.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import Table from '../../ui/Table.jsx'
import Menus from "../../ui/Menus.jsx";
import {useNavigate} from "react-router-dom";


const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;
const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono",serif;
`;
const Price = styled.div`
  font-family: "Sono",serif;
  font-weight: 600;
`;
const Discount = styled.div`
  font-family: "Sono",serif;
  font-weight: 500;
  margin: 0 auto;
  color: var(--color-green-700);
`;

function CabinRow({cabin}){
    const navigate = useNavigate();
    const {isDeleting, deleteCabin} = useDeleteCabin();
    const {createCabin, isCreating} = useCreateCabin();
    const {id: cabinId, name, maxCapacity,
        regularPrice, discount, image, description, images} = cabin;

    function handleDuplicate(){
        createCabin({
            name: `Copy of ${name}`,
            maxCapacity, regularPrice, discount, image, description
        });
    }

    return (
        <Table.Row>
            <Img src={image} alt='photo'/>
            <Cabin>{name}</Cabin>
            <div>Fits up to {maxCapacity} guests</div>
            <Price>{formatCurrency(regularPrice)}</Price>
            {
                discount ?
                <Discount>{formatCurrency(discount)}</Discount> :
                <p style={{margin: '0 auto'}}>&mdash;</p>
            }
            <div>
                <Modal>
                    <Menus.Menu>
                        <Menus.Toggle id={cabinId}/>

                        <Menus.List id={cabinId}>
                            <Menus.Button icon={<HiEye/>}
                                          onClick={()=> navigate(`/cabins/${cabinId}`)}>
                                See details
                            </Menus.Button>
                            <Menus.Button icon={<HiSquare2Stack/>}
                                          onClick={handleDuplicate}
                                          disabled={isCreating}>
                                Duplicate
                            </Menus.Button>

                            <Modal.Open opens='edit'>
                                <Menus.Button icon={<HiPencil/>}>
                                    Edit
                                </Menus.Button>
                            </Modal.Open>

                            <Modal.Open opens='delete'>
                                <Menus.Button icon={<HiTrash/>}>
                                    Delete
                                </Menus.Button>
                            </Modal.Open>
                        </Menus.List>

                        <Modal.Window name='edit'>
                            <CreateEditCabinForm cabinToEdit={cabin}/>
                        </Modal.Window>

                        <Modal.Window name='delete'>
                            <ConfirmDelete resourceName={`Cabin № ${name}`}
                                           disabled={isDeleting}
                                           onConfirm={()=> deleteCabin({cabinId, images})}/>
                        </Modal.Window>
                    </Menus.Menu>
                </Modal>
            </div>
        </Table.Row>
    );
}
CabinRow.propTypes = {
    cabin: PropTypes.object.isRequired
}
export default  CabinRow;