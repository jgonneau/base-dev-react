import React, { Component } from 'react'
import Parse from 'parse'

import { withRouter } from 'react-router'

import { Club, Client } from '../../utils/parse'
import { login } from '../../utils/user'

import './style.scss'

class SignIn extends Component {

  constructor(props) {

    super(props)

    this.state = {
      form: {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: 'Homme',
        birthdate: ''
      },
      isCalling: false,
      clubs: []
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {

    const that = this

    const query = new Parse.Query(Club)
    query.equalTo("gymEnabled", true);
    query.limit(1000).ascending('name').find().then(clubs => {

      const { form } = this.state
      form['club'] = clubs[0].id

      that.setState({
        clubs: clubs,
        form
      })

    })
  }

  handleInputChange(event) {

    const name = event.target.name
    const value = event.target.value

    const { form } = this.state
    form[name] = value

    this.setState({ form })
  }

  handleSubmit(evt) {

    evt.preventDefault()
    const that = this

    that.setState({ isCalling: true })

    const { clubs, form } = that.state
    const club = clubs.filter(aClub => aClub.id === form.club)[0]

    const client = new Client()
    client.set('email', form.email)
    client.set('firstname', form.firstname)
    client.set('lastname', form.lastname)
    client.set('gender', 'Homme')
    client.set('birthdate', new Date())
    client.set('clubs', [club])

    client.save().then(client => {
      that.handleLogin(client, club)
    })

  }

  handleLogin(currentClient, currentClub) {

    const user = {
      id: currentClient.id,
      email: currentClient.get('email'),
      firstname: currentClient.get('firstname')
    }
    const club = {
      id: currentClub.id,
      name: currentClub.get('name'),
      color: `#${currentClub.get('themeColor')}`
    }

    login(user, club)
    this.props.history.push('/planning')
  }

  render() {

    const { clubs, form, isCalling } = this.state

    return (
      <div className={"SignIn"}>
        <div className="SignIn__header">
          <p>Appli Studio</p>
          <p>Créez votre compte</p>
        </div>

        <form className={'SignIn__form'} onSubmit={this.handleSubmit}>

          <label htmlFor="club">Club *</label>
          <select required id="club" name="club" value={form.club} onChange={this.handleInputChange}>
            {clubs.map((row, index) =>
              <option key={index} value={row.id}>{row.get('name')}</option>
            )}
          </select>

          <label htmlFor="email">Adresse e-mail *</label>
          <input required type="email" name="email" id="email" value={form.email} onChange={this.handleInputChange} disabled={isCalling} />

          <label htmlFor="firstname">Prénom *</label>
          <input required type="text" name="firstname" id="firstname" value={form.firstname} onChange={this.handleInputChange} disabled={isCalling} />

          <label htmlFor="lastname">Nom *</label>
          <input required type="text" name="lastname" id="lastname" value={form.lastname} onChange={this.handleInputChange} disabled={isCalling} />

          <input type="submit" value="Créer votre compte" disabled={isCalling} />
        </form>
      </div>
    )
  }
}

export default withRouter(SignIn)