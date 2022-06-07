import { GETALLDATA,SETALLDATA } from '../constant'

export const getAllData = data => ({ type: GETALLDATA, data })
export const setAllData = data => ({ type: SETALLDATA, data })

