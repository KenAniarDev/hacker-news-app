import React, {Component} from 'react';


type SearchProp = {
    handleSearch: (searchTerm: string) => void;
}

class Search extends Component<SearchProp> {
    render() {
        return (
            <div className={"w-full max-w-[400px]"}>
                <input onChange={e => this.props.handleSearch(e.target.value)} type={"text"} placeholder={"search here..."} className={"outline-none border-2 border-slate-700 w-full text-xl rounded focus:shadow-xl rounded-md px-3 py-2"} />
            </div>
        );
    }
}

export default Search;