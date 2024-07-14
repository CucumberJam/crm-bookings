import styled from "styled-components";

const StyledBox = styled.div`
  width: 100%;
  margin: 50px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px 10px;
`
const Img = styled.img`
  display: block;
  width: ${(props) => props.width};
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;
export default function Image({src, alt = 'photo', width = '6.4rem'}){
    return <StyledBox>
        <Img src={src} alt={alt} width={width}/>
    </StyledBox>
}