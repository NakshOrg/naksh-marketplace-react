import * as actionTypes from '../actions/actionTypes';

const initialState = {
    allNfts: [],
    headerSearchLoading: false,
    searchLoading: false,
    searchResultsArtists: [],
    searchResultsNfts: [],
    searchKeyword: "",
    page: 1
}

const dataReducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.ALL_NFTS:
            return {
                ...state,
                allNfts: action.payload
            }
        case actionTypes.SEARCH_RESULTS:
            const results = [];
            state.allNfts.map(nft => {
                const title = nft?.metadata?.title;
                const regexTest = title.match(new RegExp(action.payload.searchKeyword, 'gi'));
                if(regexTest) {
                    results.push(nft);
                } 
            });
            return {
                ...state,
                searchResultsArtists: action.payload.artists,
                searchResultsNfts: results,
                searchKeyword: action.payload.searchKeyword
            }
        case actionTypes.HEADER_SEARCH_LOADING:
            return {
                ...state,
                headerSearchLoading: action.payload
            }
        case actionTypes.SEARCH_LOADING:
            return {
                ...state,
                searchLoading: action.payload
            }
        case actionTypes.PAGINATION:
            return {
                ...state,
                page: action.payload
            }
        default: return state;
    }
}

export default dataReducer;