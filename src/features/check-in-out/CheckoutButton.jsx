import Button from "../../ui/Button.jsx";
import useCheckout from "./hooks/useCheckout.js";

function CheckoutButton({ bookingId }) {
    const {checkout, isCheckingOut} = useCheckout();
  return (
    <Button variation="secondary"
            size="small"
            onClick={()=> checkout(bookingId)}
            disabled={isCheckingOut}>
      Check out
    </Button>
  );
}

export default CheckoutButton;
