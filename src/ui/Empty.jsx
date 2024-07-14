import styled from "styled-components";

const StyledEmptyBox = styled.div`
  margin: 0 auto;
  text-align: center;
  font-size: 3rem;
`
function Empty({ resource }) {
  return <StyledEmptyBox>
        No {resource} could be found.
  </StyledEmptyBox>;
}

export default Empty;
