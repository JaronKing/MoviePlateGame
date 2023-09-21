import './App.css';
import * as React from "react"

const moviesReducer = (state, action) => {
    switch (action.type) {
        case 'PAGE_INIT':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isInit: true,
                data: { ...dataStub }
            }
        case 'MOVIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                isInit: true,
                data: { ...dataStub }
            };
        case 'MOVIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                isInit: false,
                data: action.payload,
            };
        case 'MOVIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                isInit: true,
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

const processInput = (input, movies) => {
    // return new Promise((resolve) => {
        let movieData = [];
        movieData['movies'] = [];
        movieData['stats'] = [];

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
        // console.log(stringCombinations);
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
            movies.map((movie) => {
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
        movieData = searchDatabase(movies, movieData, filteredStringCombination);
        // console.log("here");
        // console.log(movieData);
        return movieData;
    // });
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
    },
    inputCharacterMap : [],
    movies: [],
};

const genres = [
    'Action',
    'Adventure',
    'Animation',
    'Biography',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'History',
    'Horror',
    'Music',
    'Musical',
    'Mystery',
    'Romance',
    'Sport',
    'Thriller',
    'War',
    'Western',
];

const App = () => {

    const [movies, dispatchMovies] = React.useReducer(
        moviesReducer,
        {
            data: dataStub,
            isLoading: false,
            isError: false,
            isInit: true,
        },
    );

    const [ input, setInput ] = React.useState("6YGY607");
    const [ plate, setPlate ] = React.useState('');
    const [ boolean, setBoolean ] = React.useState(1);

    const handleInputChange = (event) => {
        let string = event.target.value.toUpperCase();
        setInput(string);
    }

    const handleSeachSubmit = (event) => {
        console.log(`${input} submitted`);
        setPlate(input);
    }

    const handleGenreChange = (event) => {
        // console.log(event.target.checked);
        // console.log(event.target.defaultValue);
        // console.log(!(event.target.checked != false));
        setBoolean(!(event.target.checked !== false));
    }
    // const edges = [];
    const handleFetchMovies = React.useCallback(async () => {
        if (!plate) return;
        // if (plate.length() < 7) return;

        dispatchMovies({ type: "MOVIES_FETCH_INIT"});

        // try{
            await fetch("./movies.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                const result = processInput(input, data);
                dispatchMovies({
                    type: "MOVIES_FETCH_SUCCESS",
                    payload: result,
                });
            });
        // } catch {
        //     dispatchMovies({ type: "MOVIES_FETCH_FAILURE" });
        // }
    }, [plate, input]);

    React.useEffect(() => {
        handleFetchMovies();
    },[handleFetchMovies]);

    React.useEffect(() => {
        dispatchMovies({ type: 'PAGE_INIT'});
    }, [input]);

    return (
    <main>
        <div className="container max-w-xl m-auto">

            <div className="mb-6 pt-10 px-5">
                <label htmlFor="large-input" className="text-center block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your Car's Plate
                </label>
                <input type="text" value={input} onChange={handleInputChange} id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"/>
            </div>

            <div className="px-5 pt-5 pb-5 mb-5 mx-5 bg-gray-100 border border-gray-300 rounded-lg">
                <div>Genre</div>
                <div className="grid grid-cols-3 content-start">

                    {
                        genres.map((genre) => {
                            // let id =
                            return (
                                <label key={genre} for={genre} className="relative m-3 inline-flex items-center cursor-pointer">
                                    <input id={genre} name={genre} onChange={(e) => handleGenreChange(e)} value={genre} checked={!boolean} type="checkbox" className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{genre}</span>
                                </label>
                            )
                        })
                    }
                </div>
            </div>

            <div className="flex flex-col items-center justify-center px-5 mb-5">
                <button type="submit" onClick={handleSeachSubmit} disabled={movies.isLoading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </div>
        {movies.isLoading && (
            <div>Loading...</div>
        )}
        {movies.isError && (
            <div>Error...</div>
        )}
        {movies.isInit ? (
            <p></p>
        ) : (
            <div className="mx-5">
                <div className="grid grid-cols-7 text-center content-start bg-gray-100 pt-5 pb-5 mb-5 border border-gray-300 rounded-lg uppercase">
                    {
                        Object.entries(movies.data.inputCharacterMap).map((characterPosition, index) => {
                            return (
                                <div key={index} className="bg-gray-100">
                                {
                                    Object.entries(characterPosition).map(([index2, characters], mix) => {
                                        if (characters === 0) return true;
                                        return (
                                            Object.entries(characters).map(([index3, character], mix2) => {
                                                if (parseFloat(character)) return true;
                                                if (character === 0) return true;
                                                let characterKey = `${index3}_${character}`
                                                return (
                                                    <div key={characterKey} className="bg-gray-100">{character}</div>
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


                <div className="flex-row grid grid-cols-2 p-5 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="border border-gray-200 rounded-lg">
                        Movies Matched: { movies.data.stats.movieCount }
                    </div>
                    <div className="border border-gray-200">
                        Plate Combinations Matched: { movies.data.stats.combinationCount }
                    </div>
                    <div className="border border-gray-200">
                        Average Rating: { movies.data.stats.averageRating }
                    </div>
                    <div className="border border-gray-200">
                        Highest Rating: { movies.data.stats.highestRating }
                    </div>
                    <div className="border border-gray-200">
                        Most Matched Movie: { movies['data']['stats']['highestMovieCombinationMovie'][1] }
                    </div>
                    <div className="border border-gray-200">
                        <p>Most Matched Genre: { movies['data']['stats']['mostMatchedGenre'] }</p>
                        <p>With { movies['data']['stats']['mostMatchedGenreMax'] } matched</p>
                    </div>
                    <div className="border border-gray-200">
                        <p>Plate Combinations: { movies['data']['stats']['combinationCount'] }</p>
                    </div>
                </div>

                <div className="flex flew-row pt-5 p-5 text-enter">
                    Results<br/>
                </div>

                <div>
                    {
                        Object.entries(movies.data['movies']).map((movie, index) => {
                            return (
                                <div key={index} className="mb-5 p-5 bg-gray-100  border border-gray-300 rounded-lg">
                                    <div className="p-5">{movie[1][1]}</div>
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
