import Button from "../../ui/Button.jsx";
import Modal from '../../ui/ModalCompound.jsx'
import CreateBookingForm from "./CreateBookingForm.jsx";


export default function AddBooking(){
    return (
        <Modal>
            <Modal.Open opens='booking-form'>
                <Button>Add new Booking</Button>
            </Modal.Open>
            <Modal.Window name='booking-form'>
                <CreateBookingForm/>
            </Modal.Window>
        </Modal>
    )
}