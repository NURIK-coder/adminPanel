    const InitialState = {
        levels: [],
        faculties: [],
        universities: [],

    }

    export const FilterReducer = (state=InitialState, action)=>{
        switch(action.type){
            case 'SET_LEVELS':
                return{...state, levels: action.payload}
            case 'SET_FACULTIES':
                return{...state, faculties: action.payload}
            case 'SET_UNIVERSITIES':
                return{...state, universities: action.payload}
            
            default:
                return state
        }
    }