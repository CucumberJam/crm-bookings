import Button from "../../ui/Button.jsx";
import Modal from '../../ui/ModalCompound.jsx'
import CreateEditCabinForm from "./CreateEditCabinForm.jsx";
import CabinTable from "./CabinTable-v2.jsx";
import PropTypes from "prop-types";


export default function AddCabin({name}){
    return (
        <Modal>
            {name === 'cabins-form' && (
                <>
                    <Modal.Open opens='cabins-form'>
                        <Button>Add new Cabin</Button>
                    </Modal.Open>
                    <Modal.Window name='cabins-form'>
                        <CreateEditCabinForm/>
                    </Modal.Window>
                </>)}

            {name === 'table' && (
                <>
                    <Modal.Open opens='table'>
                        <Button>Show Table</Button>
                    </Modal.Open>
                    <Modal.Window name='table'>
                        <CabinTable/>
                    </Modal.Window>
                </>)}
        </Modal>
    )
}
/*
export default function AddCabin(){
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <Button onClick={()=>
                setOpenModal(open => !open)}>
                Add new cabin
            </Button>
            {openModal && (
                <Modal onClose={()=> setOpenModal(false)}>
                    <CreateEditCabinForm onCloseModal={
                    ()=> setOpenModal(false)}/>
                </Modal>
            )}
        </>
    );
}*/
AddCabin.propTypes = {
    name: PropTypes.string,
}