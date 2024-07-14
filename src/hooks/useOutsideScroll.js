import {useEffect, useRef} from "react";

export default function useOutsideScroll(cb, scrollCapture = true, clickCapture = false){
    const ref = useRef();
    useEffect(() => {
        function handleClick(e){
            if(ref.current && !ref.current.contains(e.target)){
                cb();
            }
        }

        document.addEventListener('click', handleClick, clickCapture);
        document.addEventListener('scroll', cb, scrollCapture);
        return ()=> {
            document.removeEventListener('click', handleClick, clickCapture);
            document.removeEventListener('scroll', cb, scrollCapture);
        }
    }, [cb, scrollCapture, clickCapture]);

    return ref;
}