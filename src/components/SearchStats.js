import * as React from "react"

const SearchStats = ({ movies }) => {

    return (
        <div className="flex-row grid grid-cols-2 p-5 bg-white border border-gray-300 shadow-lg">
            <div className="">
                Movies Matched: { movies.data.stats.movieCount }
            </div>
            <div className="">
                Plate Combinations Matched: { movies.data.stats.combinationCount }
            </div>
            <div className="">
                Average Rating: { movies.data.stats.averageRating }
            </div>
            <div className="">
                Highest Rating: { movies.data.stats.highestRating }
            </div>
            <div className="">
                Most Matched Movie: { movies['data']['stats']['highestMovieCombinationMovie'][1] }
            </div>
            <div className="">
                <p>Most Matched Genre: { movies['data']['stats']['mostMatchedGenre'] }</p>
                <p>With { movies['data']['stats']['mostMatchedGenreMax'] } matched</p>
            </div>
            <div className="">
                <p>Plate Combinations: { movies['data']['stats']['combinationCount'] }</p>
            </div>
            <div className="">
                <p>Movies Searched: { movies['data']['stats']['moviesSearched'] }</p>
            </div>
        </div>
    );
}

export default SearchStats;
