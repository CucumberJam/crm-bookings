import ButtonIcon from "../../ui/ButtonIcon.jsx";
import {HiArrowRightOnRectangle} from "react-icons/hi2";
import {useLogout} from "./hooks/useLogout.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";

export default function Logout(){
    const  {isLogoutLoading, logout} = useLogout();
    return (
        <ButtonIcon disabled={isLogoutLoading}
                    onClick={logout}>
            {! isLogoutLoading ? <HiArrowRightOnRectangle/> :
            <SpinnerMini/>}
        </ButtonIcon>
    )
}