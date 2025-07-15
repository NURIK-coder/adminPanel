const InitialState = {
    users: [],
    user: {}
}

export const userReduser = (state=InitialState, action)=>{
    switch(action.type){
        case 'SET_USERS':
            return{...state, users: action.payload}
        case 'SET_USER':
            return{...state, user: action.payload}
        default:
            return state
    }
}