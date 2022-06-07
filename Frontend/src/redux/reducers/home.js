import { GETALLDATA, SETALLDATA } from '../constant'

const initState = null
export default function mainDataReducer(preState = initState, action) {
  const { type, data } = action
  switch (type) {
    case GETALLDATA:
      return preState
    case SETALLDATA:
      return data
    default:
      return preState
  }
}