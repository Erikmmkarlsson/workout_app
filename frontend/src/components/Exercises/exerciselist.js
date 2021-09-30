import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class ExercisesList extends Component {
  constructor (props) {
    super(props)
    this.onChangeSearchName = this.onChangeSearchName.bind(this)
    this.refreshList = this.refreshList.bind(this)
    this.setActiveExercise = this.setActiveExercise.bind(this)
    this.searchName = this.searchName.bind(this)

    this.state = {
      exercisesList: [],
      currentExercise: null,
      currentIndex: -1,
      searchName: ''
    }
  }

  componentDidMount () {
    axios.get('/api/exercises')
      .then(response => {
        this.setState({
          exercisesList: response.data.data
        })
      })
  }

  onChangeSearchName (e) {
    const searchName = e.target.value
    this.setState({
      searchName: searchName
    })
  }

  refreshList () {
    this.retrieveExercises()
    this.setState({
      currentExercise: null,
      currentIndex: -1
    })
  }

  setActiveExercise (exercise, index) {
    this.setState({
      currentExercise: exercise,
      currentIndex: index
    })
  }

  searchName () {
    axios.get('/api/exercises?search=' + this.state.searchName)
      .then(response => {
        this.setState({
          exercisesList: response.data.data
        })
      })
  }

  render () {
    const { searchName, exercisesList, currentExercise, currentIndex } = this.state

    return (
      <div className='list row'>
        <div className='col-md-8'>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Search by exercise name'
              value={searchName}
              onChange={this.onChangeSearchName}
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-secondary'
                type='button'
                onClick={this.searchName}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <h4>Exercises</h4>
          <ul className='list-group'>
            {exercisesList &&
              exercisesList.map((exercise, index) => (
                <li
                  className={
                    'list-group-item ' +
                    (index === currentIndex ? 'active' : '')
                  }
                  onClick={() => this.setActiveExercise(exercise, index)}
                  key={index}
                >
                  {exercise.name}
                </li>
              ))}
          </ul>
        </div>
        <div className='col-md-6'>
          {currentExercise ? (
            <div>
              <h4>Exercise</h4>
              <div>
                <label>
                  <strong>
                    Name:
                  </strong>
                </label>{' '}
                {currentExercise.name}
              </div>
              <div>
                <label>
                  <strong>
                    Description:
                  </strong>
                </label>{' '}
                {currentExercise.description}
              </div>
              <div>
                <label>
                  <strong>
                    Updated:
                  </strong>
                </label>{' '}
                {currentExercise.last_updated} GMT
              </div>
              <Link
                to={'/exercises/' + currentExercise.id}
                className='btn btn-warning'
                style={{ marginTop: 25 }}
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on an Exercise...</p>
            </div>
          )}
        </div>
        <div>
          <Link
            to='/exercises/add'
            className='btn btn-success'
            style={{ marginTop: 25 }}
          >
            Add new
          </Link>
        </div>
      </div>
    )
  }
}
