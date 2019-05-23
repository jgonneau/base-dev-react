import React, { Component } from 'react'
import moment from 'moment'
import Loader from '../Loader'
import './style.scss'

class PlanningList extends Component {

  constructor(props) {

    super(props)
  }

  render() {

    const crs = this.props.course.map( (crs, i) => {
      return (

          <div key={'crs' + i}> { crs.get('name') } </div>
      )
    } );

    return (
      
      <React.Fragment>
        <br/>
        { 
          crs
       }
      </React.Fragment>

    )
  }
}

export default PlanningList
