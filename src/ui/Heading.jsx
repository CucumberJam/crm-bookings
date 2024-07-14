import styled, {css} from 'styled-components'

const text = css`
  text-align: center;
  ${10 > 5 && 'color: var(--color-brand-300);'}
`

const Heading = styled.h1`
  ${(props) => props.as === 'h1' && css`
    font-size: 3rem;
    font-weight: 500;`}

  ${(props) => props.as === 'h3' && css`
    font-size: 2.5rem;
    font-weight: 500;`}

  ${(props) => props.as === 'h4' && css`
    font-size: 2rem;
    font-weight: 400;`}
  
  color: var(--color-brand-200);
  line-height:1.4;
  ${text}
`
export default Heading;