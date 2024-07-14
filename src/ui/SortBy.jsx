import PropTypes from "prop-types";
import Select from "./Select.jsx";
import {useSearchParams} from "react-router-dom";

export default function SortBy({options}){
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get('sortBy') || ''
    function handleChange(e){
        searchParams.set('sortBy', e.target.value);
        setSearchParams(searchParams);
    }
    return (
        <Select options={options}
                value={sortBy}
                type='white'
                onChange={handleChange}/>
    );
}
SortBy.proptype = {
    options: PropTypes.array.isRequired
}