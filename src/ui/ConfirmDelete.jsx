import styled from "styled-components";
import Button from "./Button.jsx";
import Heading from "./Heading";
import PropTypes from "prop-types";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

// eslint-disable-next-line react/prop-types
function ConfirmDelete({resourceName, onConfirm, disabled, onCloseModal} ) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently?
          <br/>
        This action cannot be undone.
      </p>

      <div>
        <Button variation="secondary"
                disabled={disabled}
                onClick={onCloseModal}>
          Cancel
        </Button>
        <Button variation="danger"
                disabled={disabled}
                onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}
ConfirmDelete.propsType = {
    resourceName: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func
}
export default ConfirmDelete;
