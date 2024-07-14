import Modal from "../../ui/ModalCompound.jsx";
import Button from "../../ui/Button.jsx";
import CreateEditGuestForm from "./CreateEditGuestForm.jsx";

export default function AddGuest(){
    return (
        <Modal>
            <Modal.Open opens='guest-form'>
                <Button>Add new Guest</Button>
            </Modal.Open>
            <Modal.Window name='guest-form'>
                <CreateEditGuestForm/>
            </Modal.Window>
        </Modal>
    )
}