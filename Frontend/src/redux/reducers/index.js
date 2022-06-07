// 汇总所有reducer
import { combineReducers } from 'redux'

import allData from './home'


//汇总所有的reducer变为一个总的reducer
export default combineReducers({
  allData
})