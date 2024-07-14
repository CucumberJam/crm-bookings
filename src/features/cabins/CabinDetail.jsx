import { useMoveBack } from "../../hooks/useMoveBack.js";
import useGetCabin from "./hooks/useGetCabin.js";

import styled from "styled-components";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonText from "../../ui/ButtonText.jsx";
import Spinner from "../../ui/Spinner.jsx";
import Empty from "../../ui/Empty.jsx";
import CabinDataBox from "./CabinDataBox.jsx";
import Tag from "../../ui/Tag.jsx";
import {format} from "date-fns";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function CabinDetail() {
    const {cabinId, cabin, isLoading} = useGetCabin();
    const moveBack = useMoveBack();

    if(isLoading) return <Spinner/>
    if(!cabin) return <Empty resource={`Cabin with №${cabin?.name}`}/>

    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                  <Heading as="h1">Cabin #{cabin?.name}</Heading>
                  <Tag type='green'>Date of creation: {format(new Date(cabin?.created_at), "EEE, MMM dd yyyy")}</Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>
            <CabinDataBox cabin={cabin} cabinId={cabinId}/>
        </>
    );
}

export default CabinDetail;
