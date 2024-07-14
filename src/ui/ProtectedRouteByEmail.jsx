import useGetUser from "../features/authentication/hooks/useGetUser.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function ProtectedRouteByEmail({children}){
    const {isMainUser} = useGetUser();
    const navigate = useNavigate();
    useEffect(() => {
        if(!isMainUser) {
            navigate('/dashboard');
        }
    }, [isMainUser, navigate]);

    if(isMainUser) return children;
}