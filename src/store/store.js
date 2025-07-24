import { combineReducers , createStore, applyMiddleware} from 'redux'
import { thunk } from 'redux-thunk'
import { ApplicationReduser } from './applications/applicartionReducer'
import { userReduser } from './user/userReduser'
import { StatsReducer } from './status/statusReducer'
import { FilterReducer } from './filtres/filterReducer'


const rootReduser = combineReducers(
    {
        applicationsInfo: ApplicationReduser,
        userInfo: userReduser,
        statsInfo:StatsReducer,
        filterInfo: FilterReducer   
    }
)

export const store = createStore(rootReduser, applyMiddleware(thunk))