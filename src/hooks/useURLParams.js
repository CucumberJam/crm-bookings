import {useSearchParams} from "react-router-dom";

export default function useURLParams(key){
    const [searchParams, setSearchParams] = useSearchParams();
    const getURLParams = value=> searchParams.get(key);
    function updateURlParam(value){
        searchParams.set(key, value);
        setSearchParams(searchParams);
    }

    return [getURLParams, updateURlParam];
}