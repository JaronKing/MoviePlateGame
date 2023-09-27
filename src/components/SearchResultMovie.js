import * as React from "react"

function matchedTitle(movie) {
    let combinationStringArray = movie[1]['matchedString'][0];
    let movieTitle = movie[1][1].toLowerCase();
    let movieArray = movieTitle.split(' ');
    let movieTitleArray = [];
    for (let a = 0; a < movieArray.length; a++) {
        movieTitleArray.push(movieArray[a].split(''));
    }

    let stringDifference = movieArray.length - combinationStringArray.length;
    let matchArray = [];
    let matchFound = 0;
    let beginningMatch = 0;
    for (let a = 0; a <= stringDifference; a++) {
        if (matchFound) break;
        let match  = 0;
        let offset = a;
        for (let b = offset; b < movieArray.length; b++) {
            if (match === combinationStringArray.length) {
                matchFound = 1;
                break;
            }
            if (movieArray[b].includes(combinationStringArray[match])) {
                match++;
                matchArray.push(movieArray[b]);
                if (beginningMatch === 0) {
                    beginningMatch = b;
                }
                continue;
            } else {
                matchArray = [];
                beginningMatch = 0;
                break;
            }
        }
    }

    let matchCount = 0;
    console.log(beginningMatch);

    for (let a = beginningMatch; a < movieArray.length; a++) {
        for(let b = 0; b < movieTitleArray[a].length; b++) {
            if (typeof combinationStringArray[matchCount] === "undefined") break;
            console.log(`${movieTitleArray[a][b]} === ${combinationStringArray[matchCount]}`);
            if (movieTitleArray[a][b].includes(combinationStringArray[matchCount])) {
                console.log('match found');
                movieTitleArray[a][b].toUpperCase();
                movieTitleArray[a][b] = `<b>${movieTitleArray[a][b]}</b>`
                movieTitleArray[a].join();
                matchCount++;
                break;
            }
            if (matchCount >= movieTitleArray.length) break;
        }
        if (matchCount >= movieTitleArray.length) break;
    }
    let movieTitleString = movieTitleArray.map(e => e.join('')).join(' ');
    console.log(matchArray);
    console.log(movieTitleString);
    return movieTitleString;
}
// movie[1]['matchedString'][]
const SearchResultMovie = ({ movie }) => {
    const [ movieTitleHTML, setMovieTitleHTML ] = React.useState('');

    React.useEffect(() => {
        let combinationStringArray = movie[1]['matchedString'][0];
        let movieTitle = movie[1][1].toLowerCase();
        let movieArray = movieTitle.split(' ');
        let movieTitleArray = [];
        for (let a = 0; a < movieArray.length; a++) {
            movieTitleArray.push(movieArray[a].split(''));
        }

        let stringDifference = movieArray.length - combinationStringArray.length;
        let matchArray = [];
        let matchFound = 0;
        let beginningMatch = 0;
        for (let a = 0; a <= stringDifference; a++) {
            if (matchFound) break;
            let match  = 0;
            let offset = a;
            for (let b = offset; b < movieArray.length; b++) {
                if (match === combinationStringArray.length) {
                    matchFound = 1;
                    break;
                }
                if (movieArray[b].includes(combinationStringArray[match])) {
                    match++;
                    matchArray.push(movieArray[b]);
                    if (beginningMatch === 0) {
                        beginningMatch = b;
                    }
                    continue;
                } else {
                    matchArray = [];
                    beginningMatch = 0;
                    break;
                }
            }
        }

        let matchCount = 0;
        for (let a = beginningMatch; a < movieArray.length; a++) {
            for(let b = 0; b < movieTitleArray[a].length; b++) {
                if (typeof combinationStringArray[matchCount] === "undefined") break;
                if (movieTitleArray[a][b].includes(combinationStringArray[matchCount])) {
                    movieTitleArray[a][b].toUpperCase();
                    movieTitleArray[a][b] = `<b>${movieTitleArray[a][b]}</b>`
                    movieTitleArray[a].join();
                    matchCount++;
                    break;
                }
                if (matchCount >= movieTitleArray.length) break;
            }
            if (matchCount >= movieTitleArray.length) break;
        }
        let movieTitleString = movieTitleArray.map(e => e.join('')).join(' ');
        setMovieTitleHTML(movieTitleString);
    }, []);
    return (
        <div className="mb-5 p-5 bg-white shadow-lg border border-gray-300">
            <div className="px-5">{movie[1][1]}</div>
            <div className="px-5">Genre: {movie[1][2]}</div>
            <div className="px-5">Rating: {movie[1][3]}</div>
            <div className="px-5">Matches: {movie[1]['matches']}</div>
            <div className="px-5">
                <div>Matched Plate Combinations</div>
                <div dangerouslySetInnerHTML={{__html: movieTitleHTML}}>
                </div>
            </div>
        </div>
    );
}

export default SearchResultMovie