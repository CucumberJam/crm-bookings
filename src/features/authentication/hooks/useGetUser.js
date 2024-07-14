import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../../services/apiAuth.js";
import {MAIN_EMAILS} from "../../../utils/rights.js";

export default function useGetUser(){
    const {isLoading, data: user} = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,

    });
    const isMainUser = MAIN_EMAILS.includes(user?.email);
    return {isLoading, user, isAuthenticated: user?.role === 'authenticated', isMainUser};
}