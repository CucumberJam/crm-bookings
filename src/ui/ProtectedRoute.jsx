import useGetUser from "../features/authentication/hooks/useGetUser.js";
import Spinner from "./Spinner.jsx";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {useEffect} from "react";

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`
export default function ProtectedRoute({children}){
    //1 Load auth-ed user
    const {isLoading, isAuthenticated} = useGetUser();

    const navigate = useNavigate();
    
    //2 if no auth-ed user redirect to loginPage
    useEffect(() => {
        if(!isAuthenticated && !isLoading) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    //3 while loading show sinner
    if(isLoading) return (
        <FullPage>
            <Spinner/>
        </FullPage>
    );

    //4 If there is a user render page
    if(isAuthenticated) return children;
}