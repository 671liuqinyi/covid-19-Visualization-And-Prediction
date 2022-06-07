import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllData } from '../../redux/actions/home'
import Loading from '../Loading'


class Test extends Component {
  componentDidMount() {
    // console.log(this.props)
    // getMainData('test')
  }
  render() {
    // console.log(this.props)
    return (
      <div>
        <Loading />
      </div>
    )
  }
}
export default connect(
  state => ({
    mainData: state.mainData
  }),
  { getAllData }
)(Test)