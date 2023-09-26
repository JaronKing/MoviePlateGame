import * as React from "react"

import SearchResultMovie from './SearchResultMovie';

const SearchResults = ({ movies }) => {

    return (
        <>
            <div className="flex flew-row pt-5 p-5 text-enter">
                Results<br/>
            </div>

            <div>
                {
                    Object.entries(movies.data.movies || {}).map((movie) => {
                        return (
                            <SearchResultMovie movie={movie} key={movie[1][0]} />
                        );
                    })
                }
            </div>
        </>
    );
}

export default SearchResults;