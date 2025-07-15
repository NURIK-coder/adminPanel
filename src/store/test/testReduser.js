const InitialState = {
    questions:{},
    answers:[],
    tests:[],
    testDetail:{},
    nextTestDetail: {}
}

export const TestReduser = (state=InitialState, action)=>{
    switch(action.type){
        case 'SET_TESTS':
            return{...state, tests: action.payload}
        case 'SET_ANSWERS':
            return{...state, answers: action.payload}
        case 'SET_QUESTIONS':
            return{...state, questions: action.payload}
        case 'SET_TESTDETAIL':
            return{...state, testDetail: action.payload}
        
        default:
            return state
    }
}