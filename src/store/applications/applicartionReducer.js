const InitialState = {
    applications: [],
    applicationDetail:{},
    leaders: [],
    gpa_leaders: [],
    mandad: []
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
        case 'SET_MANDAD':
            return{...state, mandad: action.payload}
        default:
            return state
    }
}