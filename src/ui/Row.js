import styled, {css} from "styled-components";

const Row = styled.div`
  display: flex;
  align-items: center;
  
  ${(props)=> props.type ==='horizontal' && 
          css`
            justify-content: space-between;
          `}
  ${(props)=> props.type ==='vertical' &&
          css`
            flex-direction: column;
            gap: 1.6rem;
          `}
`
Row.defaultProps = {
    type: 'vertical',
};
export default Row;