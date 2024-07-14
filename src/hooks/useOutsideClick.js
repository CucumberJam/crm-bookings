import {useEffect, useRef} from "react";

export default function useOutsideClick(cb, listenCapturing = true){
    const ref = useRef();
    useEffect(() => {
        function handleClick(e){
            if(ref.current && !ref.current.contains(e.target)){
                cb();
            }
        }
        document.addEventListener('click', handleClick, {capture: listenCapturing});
        return ()=> document.removeEventListener('click', handleClick);
    }, [cb, listenCapturing]);

    return ref;
}