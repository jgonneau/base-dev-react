import React, { Component } from 'react'
import Parse from 'parse'
import moment from 'moment'
import 'moment/locale/fr'

import 'react-dates/initialize'
import { SingleDatePicker } from 'react-dates'

import Ionicon from 'react-ionicons'

import { getItem } from '../../utils/localStorage'
import { Club, Client, Booking, Cours, CoursTemplate, Product } from '../../utils/parse'; //'../utils/parse'

//import PlanningList from 'components/PlanningList'

import Loader from '../../components/Loader'

import { toast } from 'react-toastify'

import './style.scss'

export default class Planning extends Component {

  constructor(props) {

    super(props)

    this.state = {
      club: Club.createWithoutData(getItem('club').id),
      user: Client.createWithoutData(getItem('user').id),
      focused: false,
      courses: [],
      rooms: [],
      concepts: [],
      filters: {
        room: 'Toutes',
        concept: 'Tous'
      },
      date: moment(),
      isCalling: true,
      isFilterListVisible: false,
      isFetching: false,
      bookingDisabled: false
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.triggerFilters = this.triggerFilters.bind(this)
    
    moment.locale('fr')
  }

  componentWillMount() {

    const that = this
    that.getClient()
  }
  
  getClient() {

    const that = this

    let query = new Parse.Query(Client)
    query.equalTo('objectId', JSON.parse(localStorage.getItem('user')).id)
    query.first().then(client => {
      that.setState({
        bookingDisabled: client.get('bookingDisabled')
      }, () => that.getFilters())

    })
  }

  getFilters() {

    const that = this

    let queryClub = new Parse.Query(Club)

    queryClub.equalTo('objectId', that.state.club.id)

    queryClub.first().then(club => {

      let queryConcepts = new Parse.Query(CoursTemplate)

      queryConcepts.equalTo('club', that.state.club)
      queryConcepts.limit(1000)
      queryConcepts.ascending('name')

      queryConcepts.find().then(conceptsList => {
        const concepts = conceptsList.map(row => {
          return row.get('name')
        })

        const initialRoom = club.get('initialRoom')
        const rooms = club.get('classesRooms')

        that.setState({
          rooms: rooms,
          filters: {
            room: initialRoom && Number.isInteger(initialRoom) ? rooms[initialRoom] : 'Toutes',
            concept: 'Tous'
          },
          concepts
        }, () => that.getCourses())
      })
    })
  }

  getCourses() {

    const that = this

    let query = new Parse.Query(Cours);

    var dateDebut = this.state.date.startOf('d').toDate();
    var dateFin = this.state.date.endOf('d').toDate();

    query.equalTo('club', this.state.club);
    query.greaterThanOrEqualTo( 'date', dateDebut );
    query.lessThanOrEqualTo( 'date', dateFin );

    var allCourses = query.find().then( (lescourses) => {

      console.log("courses |" + lescourses[0].get('date'));    

      this.setState({ 
        isCalling: false,
        courses : lescourses
        })

    });

    
  }

  handleLabelClick(elem) {
    if (document.createEvent) {
      let e = document.createEvent('MouseEvents')
      e.initMouseEvent(
        'mousedown',
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      this.refs[elem].dispatchEvent(e)
    }

    this.refs[elem].focus()
  }

  handleSelectChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState(
      prevState => ({
        filters: {
          ...prevState.filters,
          [name]: value
        }
      })
    )
  }

  onDateChange(date) {
    this.setState(
      prevState => ({
        date
      }),
      function () {
        this.getCourses()
      }
    )
  }
  nextDay() {
    
    const date = this.state.date
    date.add(1, 'd')
    this.setState(
      prevState => ({
        date
      }),
      function () {
        this.getCourses()
      }
    )
  }

  previousDay() {

    const date = this.state.date
    date.subtract(1, 'd')
    this.setState(
      prevState => ({
        date
      }),
      function () {
        this.getCourses()
      }
    )
  }

  triggerFilters() {
    this.setState({
      isFilterListVisible: !this.state.isFilterListVisible,
      focused: false
    })
  }

  
  render() {

    const { isCalling, courses, rooms, concepts, filters, date, focused, isFilterListVisible } = this.state

    if (isCalling) {
      return <div>Chargement</div>
    }
    else {
      let filteredCourses = courses

      // Filtering
      if (filters.room !== 'Toutes') {
        filteredCourses = filteredCourses.filter(row => {
          return row.get('room') === filters.room
        })
      }
      if (filters.concept !== 'Tous') {
        filteredCourses = filteredCourses.filter(row => {
          return row.get('name') === filters.concept
        })
      }

      // Create room's filters
      const roomFilters = rooms
        .map((rowRoom) => {
          return (
            <option key={rowRoom} value={rowRoom}>
              {rowRoom}
            </option>
          )
        })

      // Create courses' filters
      const conceptFilter = concepts
        .map((rowCourse) => {
          return (
            <option key={rowCourse} value={rowCourse}>
              {rowCourse}
            </option>
          )
        })

      return (
        <div className={'Planning MainContainer'}>
          
          <div className={'Planning_topBar'} style={{ backgroundColor: getItem('club').color }}>
            <div className={'Planning_topBar--filtersToggler'} onClick={this.triggerFilters}>
              <div>
                <span>
                  FILTRER LES COURS<Ionicon icon="md-funnel" fontSize="14px" color={getItem('club').color}/>
                </span>
              </div>
            </div>
          </div>

          <div className={'Planning_dateBar'}>
            <div className={'Planning_dateBar--arrow-back'} onClick={this.previousDay.bind(this)}>
              <Ionicon icon="ios-arrow-back" fontSize="32px" color={getItem('club').color}/>
            </div>
            <SingleDatePicker
              date={date}
              onDateChange={date => this.onDateChange(date)}
              focused={focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              id="your_unique_id"
              orientation="vertical"
              withFullScreenPortal
              hideKeyboardShortcutsPanel
              enableOutsideDays
              noBorder
              regular
              displayFormat="dddd DD MMMM"
            />
            <div className={'Planning_dateBar--arrow-forward'} onClick={this.nextDay.bind(this)}>
              <Ionicon icon="ios-arrow-forward" fontSize="32px" color={getItem('club').color}/>
            </div>
          </div>
          
          {isFilterListVisible ? (
            <div>
              <div className={'Planning_filters'}>
                <div className={'Planning_filters--item'}>
                  <label
                    htmlFor="room"
                    onClick={this.handleLabelClick.bind(this, 'roomFilter')}
                  >
                    Salle
                  </label>
                  <select
                    className={'right'}
                    ref={'roomFilter'}
                    value={filters.room}
                    name="room"
                    onChange={this.handleSelectChange}
                  >
                    <option value="Toutes">Toutes</option>
                    {roomFilters}
                  </select>
                </div>
                <div className={'Planning_filters--item'}>
                  <label
                    htmlFor="concept"
                    onClick={this.handleLabelClick.bind(this, 'conceptFilter')}
                  >
                    Cours
                  </label>
                  <select
                    className={'right'}
                    ref={'conceptFilter'}
                    value={filters.concept}
                    name="concept"
                    onChange={this.handleSelectChange}
                  >
                    <option value="Tous">Tous</option>
                    {conceptFilter}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '153px' }} />
            </div>
          ) : null}

          {isCalling.list ? (
            <Loader />
          ) : (
              <div>
                <h3>Liste des cours</h3>
              </div>
            )}
        </div>
      )
    }
  }
}