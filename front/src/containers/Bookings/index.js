import React from 'react'
import Parse from 'parse'
import moment from 'moment'
//import { getItem } from 'utils/localStorage'
//import { Club, Client, Booking, Cours, CoursTemplate, Product } from '../../utils/parse'
import './style.scss'

class Bookings extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {}

  render() {
    return (
      <div className={"Bookings MainContainer"}>
        <div className={"Bookings__content"}>
          <div>
            <h2>A compléter ...</h2>
          </div>
        </div>
      </div>
    )
  }
}

export default Bookings