const InitialState = {
    stats: {},
    stats_applications_by_type: [],
    stats_faculty_students:[],
    stats_gpa: {},
    stats_students_by_gender:[],
    stats_students_by_university: []

}

export const StatsReducer = (state=InitialState, action)=>{
    switch(action.type){
        case 'SET_STATS':
            return{...state, stats: action.payload}
        case 'SET_STATS_APPLICATIONS_BY_TYPE':
            return{...state, stats_applications_by_type: action.payload}
        case 'SET_STATS_FACULTY_STUDENTS':
            return{...state, stats_faculty_students: action.payload}
        case 'SET_STATS_GPA':
            return{...state, stats_gpa: action.payload}
        case 'SET_STUDENS_BY_GENDER':
            return{...state, stats_students_by_gender: action.payload}
        case 'SET_STUDENS_BY_UNIVERSITY':
            return{...state, stats_students_by_university: action.payload}
        default:
            return state
    }
}