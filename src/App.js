import './App.css';
import * as React from "react"

import GenresOptions from "./components/GenresOptions";
import CombinationDisplay from "./components/CombinationDisplay";
import SearchStats from "./components/SearchStats";
import SearchResults from "./components/SearchResults";
import Loader from "./components/Loader";
import moviesReducer from "./reducer";
import { processCombinationsOfPlate, processInput } from "./utils";

const genresStub = {
    Action:false,
    Adventure:false,
    Adult:true,
    Animation:false,
    Biography:false,
    Comedy:false,
    Crime:false,
    Documentary:false,
    Drama:false,
    Family:false,
    History:false,
    Horror:false,
    Music:false,
    Musical:false,
    Mystery:false,
    Romance:false,
    'Sci-Fi':false,
    Sport:false,
    Thriller:false,
    War:false,
    Western:false,
    '\\N': false,
};

const App = () => {

    const [movies, dispatchMovies] = React.useReducer(
        moviesReducer,
        {
            data: {
                stats: {
                    'movieCount': 0,
                    'highestMovieCombinationCount': 0,
                    'highestMovieCombinationMovie': [],
                    'highestStringMatchCount': 0,
                    'highestRating': 0,
                    'averageRating': 0,
                    'combinationCount':0,
                    'moviesSearched': 0,
                },
                inputCharacterMap : [],
                displayCharacterMap: [],
                movies: [],
            },
            isLoading: false,
            isError: false,
            isInit: true,
        },
    );

    const [ input, setInput ] = React.useState('5znw315');
    const [ plate, setPlate ] = React.useState('');
    const [ genres, setGenres ] = React.useState(genresStub);
    const [ boolean, setBoolean ] = React.useState([]);

    const handleInputChange = (event) => {
        let string = event.target.value.toUpperCase();
        setInput(string);
    }

    const handleSeachSubmit = (event) => {
        console.log(`${input} submitted`);
        setBoolean(genres);
        setPlate(input);
    }

    const handleFetchMovies = React.useCallback(async () => {
        if (!plate) return;
        if (plate.length < 7) return;

        await dispatchMovies({ type: "MOVIES_FETCH_INIT"});
        try{
            await fetch("./movies.json")
            .then((res) => {
                return res.json();
            })
            .then(async (data) => {
                let movieData = await processCombinationsOfPlate(plate, data, boolean, dispatchMovies)
                let result = await processInput(plate, data, boolean, dispatchMovies, movieData)
                dispatchMovies({
                    type: "MOVIES_FETCH_SUCCESS",
                    payload: result,
                });
            });
        } catch {
            dispatchMovies({ type: "MOVIES_FETCH_FAILURE" });
        }
    }, [plate, boolean]);

    React.useEffect(() => {
        handleFetchMovies();
    },[handleFetchMovies]);

    return (
        <main className="bg-white h-fit">
            <div className="container max-w-xl m-auto">

                <div className="mb-6 pt-10 px-5">
                    <label htmlFor="large-input" className="text-center block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Movie Plate Game
                    </label>
                    <input type="text" value={input} onChange={handleInputChange} disabled={movies.isLoading} id="large-input" placeholder="Enter Your License Plate" className="block w-full p-4 text-gray-900 border border-gray-300 bg-white sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center shadow-lg"/>
                </div>

                <GenresOptions genres={genres}  setGenres={setGenres}/>

            {movies.isLoading ? (
                <Loader movies={movies} />
            ) : (
                <div className="flex flex-col items-center justify-center px-5 mb-5">
                    <button type="submit" onClick={handleSeachSubmit} disabled={movies.isLoading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium shadow-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-lg">Search</button>
                </div>
            )}
            {movies.isError && (
                <div>Error...</div>
            )}
            {movies.isInit ? (
                <p>Search for a movie that matches combinations of letters found on your plate. </p>
            ) : (
                <div className="mx-5">

                    <CombinationDisplay movies={movies} />

                    <SearchStats movies={movies} />

                    <SearchResults movies={movies} />

                </div>
                )}
            </div>

        </main>
    )
}

export default App
