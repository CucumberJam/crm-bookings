import {useMutation, useQueryClient} from "@tanstack/react-query";
import {logout as logoutAPI} from "../../../services/apiAuth.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
export function useLogout(){
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {isLoading: isLogoutLoading, mutate: logout} = useMutation({
        mutationFn: logoutAPI,
        onSuccess: ()=>{
            queryClient.removeQueries();
            navigate('/login');
            toast.success(`Logout was successfully performed!`);
        },
        onError: error =>  {
            console.log(error);
            toast.error(error.message)
        }
    })
    return {isLogoutLoading, logout};
}