import styled from "styled-components";

import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import useGetTodayActivity from "./hooks/useGetTodayActivity.js";
import Spinner from "../../ui/Spinner.jsx";
import TodayItem from "./TodayItem.jsx";

const StyledToday = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem 3.2rem 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
`;

const TodayList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

function TodayActivity() {
    const {isLoading, todayActivities} = useGetTodayActivity();

    return (
        <StyledToday>
            <Row type="horizontal">
                <Heading as="h2">Today</Heading>
            </Row>
            {!isLoading ? (
                todayActivities?.length > 0 ? (
                    <TodayList>
                      {todayActivities.map(el => <TodayItem key={el.id} activity={el}/>)}
                    </TodayList>
                ) : <NoActivity>No activity today...</NoActivity>)
                : <Spinner/>}
        </StyledToday>
    );
}

export default TodayActivity;
