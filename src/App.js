import './App.css';
import * as React from "react"

import GenresOptions from './components/GenresOptions';
import CombinationDisplay from './components/CombinationDisplay';
import SearchStats from './components/SearchStats';
import SearchResults from './components/SearchResults';
import Loader from './components/Loader';

const moviesReducer = (state, action) => {
    switch (action.type) {
        case 'PAGE_INIT':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isInit: true,
                loadMessage: 'Searching...',
            }
        case 'MOVIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                isInit: true,
                loadMessage: 'Initiating search...',
            };
        case 'MOVIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isInit: false,
                data: action.payload,
                loadMessage: 'Successfully get movie list...',
            };
        case 'MOVIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                isInit: true,
            };
        case 'MOVIES_GENERATED_STRINGS':
            return {
                ...state,
                loadMessage: 'Generate String combinations from Plate',
            };
        case 'MOVIES_GENERATED_SEARCHING':
            return {
                ...state,
                loadMessage: 'Searching Movies for matches',
            };
        case 'MOVIES_GENRE_FILTERED':
            return {
                ...state,
                loadMessage: 'Filtering Movies Genres',
            };
        case 'MOVIES_GENERATE_STATS':
            return {
                ...state,
                loadMessage: 'Generating Stats',
            };
        default:
            throw new Error();
    }
};

const numberMap = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const processCombinationsOfPlate = async (input, movies, movieGenres, dispatchMovies) => {
    let movieData = [];
    movieData['movies'] = [];
    movieData['stats'] = [];

    dispatchMovies({ type: "MOVIES_GENERATED_STRINGS"});
    await sleep(100);
    //Create an array matrix of characters based on input (numbers into word)
    let inputCharacterMap = [];
    for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        // inputCharacterMap[i] = [];
        let varToPush = [];
        if(isNaN(char)) {
            varToPush.push(char.toLowerCase());
        } else {
            let numberString = numberMap[char];
            // inputCharacterMap[i] = [];
            for (let a = 0; a < numberString.length; a++) {
                let numberChar = numberString.charAt(a);
                varToPush.push(numberChar);
            }
        }
        inputCharacterMap.push(varToPush);
    }

    let displayCharacterMap = [];
    for (let i = 0; i < input.length; i++) {
        let char = input.charAt(i);
        let numberChar = [];
        if(isNaN(char)) {
            numberChar[char.toLowerCase()] = 0;
        } else {
            let numberString = numberMap[char];
            for (let a = 0; a < numberString.length; a++) {
                numberChar[numberString.charAt(a)] = 0;
            }
        }
        displayCharacterMap.push(numberChar);
    }
    movieData['displayCharacterMap'] = displayCharacterMap;

    await sleep(100);
    let possibleStringsCount = 0;
    let possibleStringsCountMax = 100;
    let possibleStrings = async (characterMap) => {
        let combinations = [];
        for (let b = 0; b < characterMap[0].length; b++){
            for (let c = 0; c < characterMap[1].length; c++) {
                for (let d = 0; d < characterMap[2].length; d++) {
                    for (let e = 0; e < characterMap[3].length; e++) {
                        for (let f = 0; f < characterMap[4].length; f++) {
                            for (let g = 0; g < characterMap[5].length; g++) {
                                for (let h = 0; h < characterMap[6].length; h++) {
                                    let character0 = characterMap[0][b];
                                    let character1 = characterMap[1][c];
                                    let character2 = characterMap[2][d];
                                    let character3 = characterMap[3][e];
                                    let character4 = characterMap[4][f];
                                    let character5 = characterMap[5][g];
                                    let character6 = characterMap[6][h];
                                    let newString = character0 + character1 + character2 + character3 + character4 + character5 + character6;
                                    combinations.push(newString);
                                    possibleStringsCount ++;
                                    if (possibleStringsCount === possibleStringsCountMax) {
                                        await sleep(100);
                                        possibleStringsCount = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return combinations;
    }
    movieData['inputCharacterMap'] = inputCharacterMap;
    let possibleStringCombinations = await possibleStrings(inputCharacterMap);

    let possibleCombinations = (combinations, str) => {
        for (let i = 0; i < str.length; i++) {
            for (let j = i + 1; j < str.length + 1; j++) {
                combinations.push(str.slice(i, j));
            }
        }
        return combinations;
    }

    let stringCombinations = [];
    for (let a = 0; a < possibleStringCombinations.length; a++) {
        stringCombinations = possibleCombinations(stringCombinations, possibleStringCombinations[a]);
    }

    let countBefore = stringCombinations.length;
    //clear duplicate stringCombinations and remove single string
    for (let a = 0; a < stringCombinations.length; a++) {
        for (let b = 0; b < stringCombinations.length; b++) {
            if (a !== b) {
                if (stringCombinations[a] === stringCombinations[b]) {
                    stringCombinations.splice(b,1);
                }
            }
        }
    }
    let countAfter = stringCombinations.length;
    console.log(`Before: ${countBefore}  After:${countAfter}`);

    //clear single letter strings
    function combinationStringMinLength(string) {
        return string.length > 3;
    }
    let filteredStringCombination = stringCombinations.filter(combinationStringMinLength);
    let combinationCount = filteredStringCombination.length;
    movieData['stats']['combinationCount'] = combinationCount;
    console.log(`1Before: ${countAfter}  After:${combinationCount}`);
    movieData['stats']['filteredStringCombination'] = filteredStringCombination;
    await sleep(100);
    return movieData;
}

const processInput = async (input, movies, movieGenres, dispatchMovies, movieData) => {

    // Search database given string
    async function searchDatabase(movies, movieData, stringCombinations) {
        movieData['stats']['combinationCount'] = stringCombinations.length;
        // get genre count
        movieData['stats']['genres'] = [];
        movieData['stats']['mostMatchedGenre'] = '';
        movieData['stats']['mostMatchedGenreMax'] = 0;
        movieData['stats']['movieCount'] = 0;
        movieData['stats']['averageRating'] = 0;
        movieData['stats']['highestRating'] = 0;
        movieData['stats']['highestMovieCombinationMovie'] = [];
        movieData['stats']['highestMovieCombinationCount'] = 0;
        movieData['stats']['moviesSearched'] = 0;

        let sleepCycleCount = 0;
        const sleepCycleMax = 1000;
        // loop through each movie that passes genre
        for (const property in movies) {
            // console.log(movies[property]);
            // count total movies searched
            movieData['stats']['moviesSearched'] ++;

            // loop through each string combination to match
            for (const stringCombination in stringCombinations) {

                let stringArray = stringCombinations[stringCombination].split("");
                let movieTitleArray = movies[property][1].toLowerCase().split(" ");
                //check if string array to big, if so skip
                if (movieTitleArray.length < stringArray.length) break;
                //checkk if movie title is one word, skip if so
                if (movieTitleArray.length < 2) break;
                // create a for loop to match the string in different positions of the title
                let arrayDiference = movieTitleArray.length - stringArray.length;
                for(let a = 0; a <= arrayDiference; a++) {
                    let wordMatchCount = 0;
                    let combinationLength = stringArray.length;
                    for(let c = 0; c < combinationLength; c++) {

                        let movieWordPosition = a + c;
                        //check if title has a matching word
                        if (movieTitleArray[movieWordPosition].includes(stringArray[c])) {
                            wordMatchCount++;
                            if (wordMatchCount === stringArray.length) {
                                if (movieData['movies'][property] !== undefined) {
                                    movies[property]['matches'] ++;
                                    if(movies[property]['matchMax'] < stringCombinations[stringCombination].length){
                                        movieData['movies'][property]['matchMax'] = stringCombinations[stringCombination].length;
                                    }
                                    movieData['movies'][property]['matchedString'].push(stringCombinations[stringCombination]);
                                } else {
                                    let movieToPush = movies[property];
                                    movieToPush['matchedString'] = [];
                                    movieToPush['matches'] = 1;
                                    movieToPush['matchedString'].push(stringCombinations[stringCombination]);
                                    movieToPush['matchMax'] = stringCombinations[stringCombination].length;
                                    movieData['movies'][property] = movieToPush;
                                }
                            }
                        } else {
                            break;
                        }
                    }
                }
            }

            sleepCycleCount++;
            if (sleepCycleMax === sleepCycleCount) {
                await sleep(1);
                sleepCycleCount = 0;
            }
        }


        //round rating
        console.log(movieData);
        // movieData['movies'].sort(function(a, b){return parseFloat(b[1]['matches']) - parseFloat(a[1]['matches'])});
        return movieData;
    }
    const filteredGenres = [];
    for (const [key, value] of Object.entries(movieGenres)) {
        if (value) filteredGenres.push(key);
    }
    dispatchMovies({ type: "MOVIES_GENRE_FILTERED"});
    await sleep(100);
    const filteredMovies = movies.filter((movie, index) => {
        let movieG = movie[2].split(',');
        return !(movieG.some(item => filteredGenres.includes(item.toString())));
    });

    dispatchMovies({ type: "MOVIES_GENERATED_SEARCHING"});
    await sleep(100);
    movieData = await searchDatabase(filteredMovies, movieData, movieData['stats']['filteredStringCombination']);

    async function getMatchStats(movieData) {

        for (const property in movieData['movies']) {
            // highest rating
            if(movieData['stats']['highestRating'] < parseFloat(movieData['movies'][property][3])) {
                movieData['stats']['highestRating'] = parseFloat(movieData['movies'][property][3]);
            }

            //average rating
            if (movieData['stats']['averageRating'] === 0) {
                movieData['stats']['averageRating'] = parseFloat(movieData['movies'][property][3]);
            } else {
                movieData['stats']['averageRating'] = (movieData['stats']['averageRating'] + parseFloat(movieData['movies'][property][3])) / 2;
            }

            //genre rating
            let genres = movieData['movies'][property][2].split(',');
            genres.map((genre) => {
                if (movieData['stats']['genres'][genre] !== undefined) {
                    movieData['stats']['genres'][genre] ++;
                } else {
                    movieData['stats']['genres'][genre] = 1;
                }
                if (movieData['stats']['genres'][genre] > movieData['stats']['mostMatchedGenreMax']) {
                    movieData['stats']['mostMatchedGenreMax'] = movieData['stats']['genres'][genre];
                    movieData['stats']['mostMatchedGenre'] = genre;
                }
                return genre;
            });

            //movie count
            movieData['stats']['movieCount'] ++;

            //highest combinations found for one movie
            if (movieData['stats']['highestMovieCombinationCount'] < movieData['movies'][property]['matches']) {
                movieData['stats']['highestMovieCombinationCount'] = movieData['movies'][property]['matches'];
                movieData['stats']['highestMovieCombinationMovie'] = movieData['movies'][property];
            }

            //longest match found
            if (movieData['stats']['highestStringMatchCount'] < movieData['movies'][property]['matchMax']) {
                movieData['stats']['highestStringMatchCount'] = movieData['movies'][property]['matchMax'];
            }
            await sleep(1);
        }
        movieData['stats']['averageRating'] = movieData['stats']['averageRating'].toFixed(1);
        return movieData;
    }

    dispatchMovies({ type: "MOVIES_GENERATE_STATS"});
    await sleep(100);
    movieData = await getMatchStats(movieData);
    return movieData;
}

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


    // const edges = [];
    const handleFetchMovies = React.useCallback(async () => {
        if (!plate) return;
        if (plate.length < 7) return;

        await dispatchMovies({ type: "MOVIES_FETCH_INIT"});
        // try{
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
        // } catch {
        //     dispatchMovies({ type: "MOVIES_FETCH_FAILURE" });
        // }
    }, [plate, boolean]);

    React.useEffect(() => {
        handleFetchMovies();
    },[handleFetchMovies]);

    // React.useEffect(() => {
    //     dispatchMovies({ type: 'PAGE_INIT'});
    // }, [input]);
    return (
    <main className="bg-white h-fit">
        <div className="container max-w-xl m-auto">

            <div className="mb-6 pt-10 px-5">
                <label htmlFor="large-input" className="text-center block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Move Plate Game
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
