import {useQuery} from "@tanstack/react-query";
import {getStaysTodayActivity} from "../../../services/apiBookings.js";

export default function useGetTodayActivity(){
    const {isLoading, data: todayActivities} = useQuery({
        queryFn: getStaysTodayActivity,
        queryKey: ['today-activity']
    });

    return {isLoading, todayActivities};
}