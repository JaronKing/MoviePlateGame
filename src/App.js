import './App.css';
import * as React from "react"
import { Accordion, Spinner } from 'flowbite-react';

const moviesReducer = (state, action) => {
    switch (action.type) {
        case 'PAGE_INIT':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isInit: true,
                data: { ...dataStub },
                loadMessage: 'Searching...',
            }
        case 'MOVIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                isInit: true,
                data: { ...dataStub },
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
                loadMessage: 'Generated Plate Combinations',
            };
        case 'MOVIES_GENERATED_SEARCHING':
            return {
                ...state,
                loadMessage: 'Searching Movies for matches',
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

const processInput = (input, movies, movieGenres, dispatchMovies) => {
    return new Promise((resolve) => {
        let movieData = [];
        movieData['movies'] = [];
        movieData['stats'] = [];

        dispatchMovies({ type: "MOVIES_GENERATED_STRINGS"});
        // console.log(stringCombinations);
        // console.log(movieData);
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
        // console.log(inputCharacterMap);

        let possibleStrings = (characterMap) => {
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
        let possibleStringCombinations = possibleStrings(inputCharacterMap);

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
        // console.log(`Before: ${countBefore}  After:${countAfter}`);

        // Search database given string
        function searchDatabase(movies, movieData, stringCombinations) {
            // console.log("search db");
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
            movies.map((movie) => {
                movieData['stats']['moviesSearched'] ++;
                stringCombinations.map((string, index) => {
                    let stringArray = string.split("");
                    let movieTitleArray = movie[1].toLowerCase().split(" ");
                    //check if string array to big, if so skip
                    if (movieTitleArray.length < stringArray.length) {
                        return null;
                    }
                    //checkk if movie title is one word, skip if so
                    if (movieTitleArray.length < 2) {
                        return null;
                    }
                    let arrayDiference = movieTitleArray.length - stringArray.length;
                    for(let a = 0; a <= arrayDiference; a++) {
                        let wordMatchCount = 0;
                        for(let c = 0; c < stringArray.length; c++) {

                            let movieWordPosition = a + c;
                            //check if title has a matching word
                            if (movieTitleArray[movieWordPosition].includes(stringArray[c])) {
                                wordMatchCount++;
                                if (wordMatchCount === stringArray.length) {
                                    if (movieData['movies'][movie[0]] !== undefined) {
                                        movieData['movies'][movie[0]]['matches'] ++;

                                        //highest combinations found for one movie
                                        if (movieData['stats']['highestMovieCombinationCount'] < movieData['movies'][movie[0]]['matches']) {
                                            movieData['stats']['highestMovieCombinationCount'] = movieData['movies'][movie[0]]['matches'];
                                            movieData['stats']['highestMovieCombinationMovie'] = movieData['movies'][movie[0]];
                                        }

                                        if(movieData['movies'][movie[0]]['matchMax'] < string.length){
                                            movieData['movies'][movie[0]]['matchMax'] = string.length;
                                        }
                                        movieData['movies'][movie[0]]['matchedString'].push(string);
                                    } else {
                                        let movieToPush = movie;
                                        movieData['stats']['movieCount'] ++;
                                        movieToPush['matchedString'] = [];
                                        movieToPush['matches'] = 1;
                                        movieToPush['matchedString'].push(string);
                                        movieToPush['matchMax'] = string.length;
                                        movieData['movies'][movie[0]] = movieToPush;

                                        //genres
                                        let genres = movieToPush[2].split(',');
                                        // console.log(genres);
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
                                            return true;
                                        });
                                        //average rating
                                        if (movieData['stats']['averageRating'] === 0) {
                                            movieData['stats']['averageRating'] = parseFloat(movieToPush[3]);
                                        } else {
                                            movieData['stats']['averageRating'] = (movieData['stats']['averageRating'] + parseFloat(movieToPush[3])) / 2;
                                        }

                                        // highest rating
                                        if(movieData['stats']['highestRating'] < parseFloat(movieToPush[3])) {
                                            movieData['stats']['highestRating'] = parseFloat(movieToPush[3]);
                                        }
                                    }
                                    // stats
                                    if (movieData['stats']['highestStringMatchCount'] < string.length) {
                                        movieData['stats']['highestStringMatchCount'] = string.length;
                                    }
                                }
                            } else {
                                continue;
                            }
                        }
                    }
                    return true;
                });
                return true;
            });

            //round rating
            console.log(movieData['stats']['genres']);
            movieData['stats']['averageRating'] = movieData['stats']['averageRating'].toFixed(1);
            movieData['movies'].sort(function(a, b){return parseFloat(b[1]['matches']) - parseFloat(a[1]['matches'])});
            return movieData;
        }
        const filteredGenres = [];
        for (const [key, value] of Object.entries(movieGenres)) {
            if (value) filteredGenres.push(key);
        }
        const filteredMovies = movies.filter((movie) => {
            let movieG = movie[2].split(',');
            return !(movieG.some(item => filteredGenres.includes(item.toString())));
        });

        dispatchMovies({ type: "MOVIES_GENERATED_SEARCHING"});
        movieData = searchDatabase(filteredMovies, movieData, filteredStringCombination);

        // console.log("here");
        // console.log(movieData);
        // return movieData;
        resolve(movieData);
    });
}

const dataStub = {
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
    movies: [],
};

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
                movies: [],
            },
            isLoading: false,
            isError: false,
            isInit: true,
        },
    );

    const [ input, setInput ] = React.useState("6YGY607");
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

    const handleGenreChange = (event) => {
        // console.log(event.target.checked);
        // console.log(event.target.defaultValue);
        // console.log(!(event.target.checked != false));
        let genreValue = [];
        genreValue[event.target.defaultValue] = !(event.target.checked !== false);
        let booleanValue = {
            ...genres,
            ...genreValue,
        }
        console.log(booleanValue);
        setGenres(booleanValue);
    }
    // const edges = [];
    const handleFetchMovies = React.useCallback(async () => {
        if (!plate) return;
        if (plate.length < 7) return;

        dispatchMovies({ type: "MOVIES_FETCH_INIT"});
        // try{
            await fetch("./movies.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                processInput(plate, data, boolean, dispatchMovies)
                .then((result) => {
                    dispatchMovies({
                        type: "MOVIES_FETCH_SUCCESS",
                        payload: result,
                    });
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
                <input type="text" value={input} onChange={handleInputChange} disabled={movies.isLoading} id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 bg-white sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"/>
            </div>

            <Accordion collapseAll className="px-5 mb-5 mx-5 border border-gray-300 bg-white shadow-lg rounded-none">
                <Accordion.Panel>
                    <Accordion.Title className="bg-white hover:bg-white rounded-none border-none">
                        Genres
                    </Accordion.Title>
                    <Accordion.Content>
                        <div className="md:columns-3 columns-2">
                            {
                                Object.keys(genres).map((genre, index) => {
                                    // console.log(genre);
                                    // if(parseFloat(genre) === 1) return true;
                                    return (
                                        <label key={genre} htmlFor={genre} className="relative m-3 inline-flex items-center cursor-pointer">
                                            <input id={genre} name={genre} onChange={(e) => handleGenreChange(e)} value={genre} checked={!genres[genre]} type="checkbox" className="sr-only peer"/>
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{genre}</span>
                                        </label>
                                    )
                                })
                            }
                        </div>
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>

        {movies.isLoading ? (
            <div className="flex flex-col items-center">
                Loading... <Spinner aria-label="Default status example" />
                { movies.loadMessage }
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center px-5 mb-5">
                <button type="submit" onClick={handleSeachSubmit} disabled={movies.isLoading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium shadow-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-lg">Submit</button>
            </div>
        )}
        {movies.isError && (
            <div>Error...</div>
        )}
        {movies.isInit ? (
            <p></p>
        ) : (
            <div className="mx-5">
                <div className="grid grid-cols-7 text-center content-start bg-white pt-5 pb-5 mb-5 uppercase shadow-lg border border-gray-300 ">
                    {
                        Object.entries(movies.data.inputCharacterMap || {}).map((characterPosition, index) => {
                            return (
                                <div key={index} className="bg-white">
                                {
                                    Object.entries(characterPosition).map(([index2, characters], mix) => {
                                        if (characters === 0) return false;
                                        if (parseFloat(index2) === 0) return false;
                                        return (
                                            Object.entries(characters).map(([index3, character], mix2) => {
                                                if (parseFloat(character)) return true;
                                                if (index3 === 0) return true;
                                                let characterKey = `${index3}_${character}`
                                                return (
                                                    <div key={characterKey} className="bg-white">{character}</div>
                                                );
                                            })
                                        );
                                    })
                                }
                                </div>
                            );
                        })
                    }
                </div>

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

                <div className="flex flew-row pt-5 p-5 text-enter">
                    Results<br/>
                </div>

                <div>
                    {
                        Object.entries(movies.data.movies || {}).map((movie, index) => {
                            return (
                                <div key={index} className="mb-5 p-5 bg-white shadow-lg border border-gray-300">
                                    <div className="px-5">{movie[1][1]}</div>
                                    <div className="px-5">Genre: {movie[1][2]}</div>
                                    <div className="px-5">Rating: {movie[1][3]}</div>
                                    <div className="px-5">Matches: {movie[1]['matches']}</div>
                                    <div className="px-5">
                                        <div>Matched Plate Combinations</div>

                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            )}
        </div>



    </main>


    )
}

export default App
