const InitialState = {
    applications: [],
    applicationDetail:{},
    leaders: [],
    gpa_leaders: [],
}

export const ApplicationReduser = (state=InitialState, action)=>{
    switch(action.type){
        case 'SET_APPLICATIONS':
            return{...state, applications: action.payload}
        case 'SET_APPLICATION':
            return{...state, applicationDetail: action.payload}
        case 'SET_LEADERS':
            return{...state, leaders: action.payload}
        case 'SET_GPA_LEADERS':
            return{...state, gpa_leaders: action.payload}
        default:
            return state
    }
}