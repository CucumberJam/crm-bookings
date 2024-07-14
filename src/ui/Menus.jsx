import styled from "styled-components";
import PropTypes from "prop-types";
import {createContext, useContext, useState} from "react";
import {HiEllipsisVertical} from "react-icons/hi2";
import {createPortal} from "react-dom";
import useOutsideScroll from "../hooks/useOutsideScroll.js";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

// eslint-disable-next-line react/prop-types
function Menus({children}){
    const [openId, setOpenId] = useState('');
    const [position, setPosition] = useState({});
    const close = ()=> setOpenId('');
    const open = setOpenId

    return (
        <MenusContext.Provider value={{openId, open, close,
                                        position, setPosition}}>
            {children}
        </MenusContext.Provider>
    );
}
Menus.prototype = {
    children: PropTypes.element,
}
// eslint-disable-next-line react/prop-types
function Toggle({id}){
    const {open, close, openId, setPosition} = useContext(MenusContext);

    const handleCLick = (e) =>{
        e.stopPropagation();
        const rect = e.target.closest('button').getBoundingClientRect();
        setPosition({
                x: window.innerWidth - rect.width - rect.x,
                y: rect.y + rect.height + 8
                });
        if(openId === '' || openId !== id){
            open(id);
        }else close();
    }

    return (
        <StyledToggle onClick={handleCLick}>
            <HiEllipsisVertical/>
        </StyledToggle>
    )
}
Toggle.prototype = {
    id: PropTypes.string,
}
// eslint-disable-next-line react/prop-types
function List({id, children}){
    const {openId, close, position} = useContext(MenusContext);

    const ref = useOutsideScroll(close);

    if(openId !== id) return null;

    return createPortal(
        <StyledList ref={ref}
                    position={{x: position.x, y: position.y}}>
            {children}
        </StyledList>, document.body)
}
List.prototype = {
    id: PropTypes.string,
    children: PropTypes.element,
}
// eslint-disable-next-line react/prop-types
function Button({icon, onClick, children}){
    const {close} = useContext(MenusContext)
    const handleClick = ()=>{
        onClick?.();
        close();
    }
    return (
        <li>
            <StyledButton onClick={handleClick}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
}
Button.prototype = {
    children: PropTypes.any,
    icon: PropTypes.any,
    onClick: PropTypes.func
}

Menus.Menu = StyledMenu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
export default Menus