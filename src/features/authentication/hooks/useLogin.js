import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login as loginAPI} from "../../../services/apiAuth.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
export function useLogin(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {isLoading: isLoginLoading, mutate: login} = useMutation({
        mutationFn: ({email,password})=> loginAPI({email,password}),
        onSuccess: (data)=>{
            navigate('/dashboard');
            toast.success(`Login was successfully performed!`);
            queryClient.setQueryData(['user'], data?.user); //session.access_token
        },
        onError: error =>  {
            console.log(error);
            toast.error(error.message)
        }
    })
    return {isLoginLoading, login};
}