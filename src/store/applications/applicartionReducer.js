const InitialState = {
    applications: [],
    applicationDetail:{},
    leaders: []
}

export const ApplicationReduser = (state=InitialState, action)=>{
    switch(action.type){
        case 'SET_APPLICATIONS':
            return{...state, applications: action.payload}
        case 'SET_APPLICATION':
            return{...state, applicationDetail: action.payload}
        case 'SET_LEADERS':
            return{...state, leaders: action.payload}
        default:
            return state
    }
}