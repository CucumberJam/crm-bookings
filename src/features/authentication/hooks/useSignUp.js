import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signUp as signUpAPI} from "../../../services/apiAuth.js";
import toast from "react-hot-toast";
export function useSignUp(){
    const queryClient = useQueryClient();

    const {isLoading: isSignUpLoading, mutate: signUp} = useMutation({
        mutationFn: ({fullName, email,password})=> signUpAPI({fullName, email,password}),
        onSuccess: (data)=>{
            console.log(data);
            toast.success(`Account successfully created! Please check out your email for verifying`);
            queryClient.setQueryData(['user'], data?.user); //session.access_token
        },
        onError: error =>  {
            console.log(error);
            toast.error(error.message)
        }
    })
    return {isSignUpLoading, signUp};
}