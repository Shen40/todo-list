function TodosViewForm({sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString}){
    const preventRefresh= (event) => {
        event.preventDefault(); 
    }
    return <form action="" onSubmit={preventRefresh}>
        <div>
            <label htmlFor="">Seach Todos</label>
            <input 
            type="text" 
            value={queryString}
            onChange={(event)=>setQueryString(event.target.value)}
            />
            <button type="button" onClick={()=>setQueryString("")}>Clear</button>
        </div>
        <div>
            <label htmlFor="sortBy">Sort by</label>
            <select 
            name="sortBy" 
            id="sortBy" 
            onChange={(event)=>setSortField(event.target.value)} 
            value={sortField}>
                <option value="title">Title</option>
                <option value="createdTime">Time added</option>
            </select>

            <label htmlFor="direction">Direction</label>
            <select name="direction" id="direction"
             onChange={(event)=>setSortDirection(event.target.value)}
             value={sortDirection}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    </form>
}

export default TodosViewForm;