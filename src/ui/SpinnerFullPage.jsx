import Spinner from "./Spinner.jsx";
import styled from "styled-components";

const StyledBox = styled.div`
  margin: 2.5rem;
  height: calc(100vh - 5rem);
  background-color: var(--color-grey-50);
`

function SpinnerFullPage() {
  return (
    <StyledBox>
      <Spinner />
    </StyledBox>
  );
}

export default SpinnerFullPage;
