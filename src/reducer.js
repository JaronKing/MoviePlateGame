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


export default moviesReducer;
