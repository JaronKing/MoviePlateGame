import * as React from "react"

const SearchResultMovie = ({ movie }) => {

    return (
        <div className="mb-5 p-5 bg-white shadow-lg border border-gray-300">
            <div className="px-5">{movie[1][1]}</div>
            <div className="px-5">Genre: {movie[1][2]}</div>
            <div className="px-5">Rating: {movie[1][3]}</div>
            <div className="px-5">Matches: {movie[1]['matches']}</div>
            <div className="px-5">
                <div>Matched Plate Combinations</div>

            </div>
        </div>
    );
}

export default SearchResultMovie