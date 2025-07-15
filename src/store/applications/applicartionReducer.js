const InitialState = {
    applications: [],
    applicationDetail:{},
    
}

export const ApplicationReduser = (state=InitialState, action)=>{
    switch(action.type){
        case 'SET_APPLICATIONS':
            return{...state, applications: action.payload}
        case 'SET_APPLICATION':
            return{...state, applicationDetail: action.payload}
        
        default:
            return state
    }
}