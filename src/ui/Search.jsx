import Row from "./Row.js";
import Input from "./Input.jsx";
import {useState} from "react";
import Select from "./Select.jsx";
import {HiMagnifyingGlass} from "react-icons/hi2";
import {useSearchParams} from "react-router-dom";
import styled from "styled-components";
import ButtonIcon from "./ButtonIcon.jsx";
import {HiOutlineBackspace} from "react-icons/hi";

const Block = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0 10px;
`;

export default function Search({options}){
    const [startSearch, setStartSearch] = useState(true);
    const [filterType, setFilterType] = useState(options[0].value);

    const [query, setQuery] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    function setType(event){
        setFilterType(event.target.value);
    }
    function setFilterParams(){
        if(!query) return;
        searchParams.set(filterType.toString(), query);
        if(searchParams.get('page')) searchParams.set('page', '1');
        setSearchParams(searchParams);
        setStartSearch(false);
    }

    function clearFilterParams(){
        setQuery('');
        if (searchParams.has(filterType.toString())) {
            searchParams.delete(filterType.toString());
        }
        if(searchParams.get('page')) searchParams.set('page', '1');
        setSearchParams(searchParams);
        setStartSearch(true);
    }
    return (
        <Row type='horizontal'>

            <Block>
                <label htmlFor='type'>Type:</label>
                <Select id='type'
                        value={filterType}
                        options={options}
                        onChange={setType}/>
            </Block>
            <Block>
            <Input id='search'
                   placeholder='Search for...'
                   value={query}
                   type='text'
                   onChange={event=> setQuery(event.target.value)}/>
            </Block>

            {query.length > 3 &&
                <ButtonIcon onClick={clearFilterParams}>
                    <HiOutlineBackspace />
                </ButtonIcon>
            }
            {(startSearch || query < 3) &&
                <ButtonIcon onClick={setFilterParams}>
                    <HiMagnifyingGlass/>
                </ButtonIcon>
            }

        </Row>
    );
}