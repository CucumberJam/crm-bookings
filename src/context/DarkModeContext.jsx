import {createContext, useContext, useEffect} from "react";
import {useLocalStorageState} from "../hooks/useLocalStorageState.js";

const DarkModeContext = createContext();

function DarkModeProvider({children}){
    const [isDarkMode, setDarkMode] = useLocalStorageState(
        window.matchMedia("(prefers-color-scheme: dark)").matches, 'isDarkMode');

    useEffect(() => {
        if(isDarkMode){
            document.documentElement.classList.remove('light-mode');
            document.documentElement.classList.add('dark-mode')
        }else{
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode')
        }
    }, [isDarkMode]);
    function toggleDarkMode(){
        setDarkMode(prev => !prev);
    }
    return (
        <DarkModeContext.Provider
        value={{isDarkMode, toggleDarkMode}}>
        {children}
    </DarkModeContext.Provider>)
}
function useDarkMode(){
    const context = useContext(DarkModeContext);
    if(context === undefined) throw new Error('DarkMode was used outside of DarkModeProvider');
    return context;
}
export {useDarkMode, DarkModeProvider};