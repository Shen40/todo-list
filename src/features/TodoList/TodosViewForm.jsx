import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    padding: 0.5rem;
`;

const StyledButton  = styled.button`
    margin:0.5rem;
`
const StyledLabel = styled.label`
  padding: 0.5rem;
`;

const StyledInput = styled.input`
  margin:0.5rem;

`;

function TodosViewForm({sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString}){
    const [localQueryString, setLocalQueryString] = useState(queryString);

    useEffect(()=>{
        const debounce = setTimeout(() => {
            setQueryString(localQueryString)
        }, 500 );
        return ()=>{
            clearTimeout(debounce);
        } 
    },[localQueryString, setQueryString ]);
    
    const preventRefresh= (event) => {
        event.preventDefault(); 
    }
    return <StyledForm action="" onSubmit={preventRefresh}>
        <div>
            <StyledLabel htmlFor="">Seach Todos</StyledLabel>
            <StyledInput 
            type="text" 
            value={localQueryString}
            onChange={(event)=>setLocalQueryString(event.target.value)}
            />
            <StyledButton type="button" onClick={()=>setLocalQueryString("")}>Clear</StyledButton>
        </div>
        <div>
            <StyledLabel htmlFor="sortBy">Sort by</StyledLabel>
            <select 
            name="sortBy" 
            id="sortBy" 
            onChange={(event)=>setSortField(event.target.value)} 
            value={sortField}>
                <option value="title">Title</option>
                <option value="createdTime">Time added</option>
            </select>

            <StyledLabel htmlFor="direction">Direction</StyledLabel>
            <select name="direction" id="direction"
             onChange={(event)=>setSortDirection(event.target.value)}
             value={sortDirection}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    </StyledForm>
}

export default TodosViewForm;