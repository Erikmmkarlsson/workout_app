import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class EditWorkout extends Component {
  constructor (props) {
    super(props)
    this.onChangeSearchName = this.onChangeSearchName.bind(this)
    this.onChangeNumSets = this.onChangeNumSets.bind(this)
    this.onChangeNumReps = this.onChangeNumReps.bind(this)
    this.onChangeNumSeconds = this.onChangeNumSeconds.bind(this)
    this.onChangeComment = this.onChangeComment.bind(this)
    this.refreshList = this.refreshList.bind(this)
    this.setActiveExercise = this.setActiveExercise.bind(this)
    this.searchName = this.searchName.bind(this)
    this.saveWorkoutExercise = this.saveWorkoutExercise.bind(this)
    this.removeExercise = this.removeExercise.bind(this)

    this.state = {
      exercisesList: [],
      selectedExercisesList: [],
      currentExercise: null,
      currentIndex: -1,
      searchName: '',
      currentExerciseId: null,
      currentWorkoutExercise: {
        workout_id: null,
        exercise_id: null,
        num_sets: null,
        num_reps: null,
        num_seconds: null,
        comment: ''
      }
    }
  }

  componentDidMount () {
    this.setState(prevState => ({
      currentWorkoutExercise: {
        ...prevState.currentWorkoutExercise,
        workout_id: parseInt(this.props.match.params.id)
      }
    }))
    axios.get('/api/exercises')
      .then(response => {
        this.setState({
          exercisesList: response.data.data
        })
      })
    axios.get('http://localhost:8000/api/workout_exercises?workout_id=' + parseInt(this.props.match.params.id))
      .then(response => {
        this.setState({
          selectedExercisesList: response.data.data
        })
      })
  }

  onChangeSearchName (e) {
    const searchName = e.target.value
    this.setState({
      searchName: searchName
    })
  }

  onChangeNumSets (e) {
    const num_sets = e.target.value
    this.setState(prevState => ({
      currentWorkoutExercise: {
        ...prevState.currentWorkoutExercise,
        num_sets: num_sets
      }
    }))
  }

  onChangeNumReps (e) {
    const num_reps = e.target.value
    this.setState(prevState => ({
      currentWorkoutExercise: {
        ...prevState.currentWorkoutExercise,
        num_reps: num_reps
      }
    }))
  }

  onChangeNumSeconds (e) {
    const num_seconds = e.target.value
    this.setState(prevState => ({
      currentWorkoutExercise: {
        ...prevState.currentWorkoutExercise,
        num_seconds: num_seconds
      }
    }))
  }

  onChangeComment (e) {
    const comment = e.target.value
    this.setState(prevState => ({
      currentWorkoutExercise: {
        ...prevState.currentWorkoutExercise,
        comment: comment
      }
    }))
  }

  refreshList () {
    this.retrieveExercises()
    this.setState({
      currentExercise: null,
      currentIndex: -1
    })
  }

  setActiveExercise (exercise, index) {
    this.setState(prevState => ({
      currentExercise: exercise,
      currentIndex: index,
      currentWorkoutExercise: {
        ...prevState.currentWorkoutExercise,
        exercise_id: exercise.id
      }
    }))
  }

  searchName () {
    axios.get('/api/exercises?search=' + this.state.searchName)
      .then(response => {
        this.setState({
          exercisesList: response.data.data
        })
      })
  }

  removeExercise (id) {
    axios.delete('http://localhost:8000/api/workout_exercises/' + id)
    axios.get('http://localhost:8000/api/workout_exercises?workout_id=' + parseInt(this.props.match.params.id))
      .then(response => {
        this.setState({
          selectedExercisesList: response.data.data
        })
      })
  }

  saveWorkoutExercise () {
    console.log(this.state.currentWorkoutExercise)
    axios({
      method: 'post',
      url: '/api/workout_exercises',
      data: this.state.currentWorkoutExercise
    })
    axios.get('http://localhost:8000/api/workout_exercises?workout_id=' + parseInt(this.props.match.params.id))
      .then(response => {
        this.setState({
          selectedExercisesList: response.data.data
        })
      })
  }

  render () {
    const { searchName, exercisesList, currentExercise, selectedExercisesList, currentIndex } = this.state

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
          <h4>Add exercises to workout {this.props.match.params.id}</h4>
          <ul className='list-group'>
            {exercisesList &&
                  exercisesList.map((exercise, index) => (
                    <li
                      className={
                        'list-group-item ' +
                        (index === currentIndex ? 'active' : '')
                      }
                      onClick={() => this.setActiveExercise(exercise, index) && this.setActiveWorkoutExercise(exercise)}
                      key={index}
                    >
                      {exercise.name}
                    </li>
                  ))}
          </ul>
          <Link
            to='/exercises/add'
            className='btn btn-success'
            style={{ marginTop: 25 }}
          >
            Add new
          </Link>
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
              <div className='form-group'>
                <label htmlFor='num_sets'>Number of sets</label>
                <input
                  type='number'
                  className='form-control'
                  id='num_sets'
                  value={this.state.currentWorkoutExercise.num_sets}
                  onChange={this.onChangeNumSets}
                  name='num_sets'
                  placeholder='Enter number of sets for this exercise'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='num_reps'>Number of reps</label>
                <input
                  type='number'
                  className='form-control'
                  id='num_reps'
                  value={this.state.currentWorkoutExercise.num_reps}
                  onChange={this.onChangeNumReps}
                  name='num_reps'
                  placeholder='Enter number of reps for this exercise'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='num_seconds'>Number of seconds</label>
                <input
                  type='number'
                  className='form-control'
                  id='num_seconds'
                  value={this.state.currentWorkoutExercise.num_seconds}
                  onChange={this.onChangeNumSeconds}
                  name='num_seconds'
                  placeholder='Enter number of seconds for this exercise'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='comment'>Comment to client</label>
                <input
                  type='text'
                  className='form-control'
                  id='comment'
                  value={this.state.currentWorkoutExercise.comment}
                  onChange={this.onChangeComment}
                  name='comment'
                  placeholder='Enter comment to client'
                />
              </div>
              <button
                type='submit'
                className='m-3 btn btn-sm btn-success'
                onClick={this.saveWorkoutExercise}
              >
                Add to Workout
              </button>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on an Exercise...</p>
            </div>
          )}
        </div>
        <div />

        <h4>Exercises in workout:</h4>
        <div className='container'>
          {selectedExercisesList.length > 0 ? (
            <table style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>
              <thead>
                <tr>
                  <th style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>Exercise name</th>
                  <th style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>Number of sets</th>
                  <th style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>Number of reps</th>
                  <th style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>Number of seconds</th>
                  <th style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {
                    selectedExercisesList.map((exercise) => (
                      <tr key={exercise.id}>
                        <td style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>{exercise.name}</td>
                        <td style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>{exercise.num_sets}</td>
                        <td style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>{exercise.num_reps}</td>
                        <td style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}>{exercise.num_seconds}</td>
                        <td style={{ 'border-width': '1px', 'border-color': 'black', 'border-style': 'solid' }}><button type='submit' className='btn btn-sm btn-danger' onClick={this.removeExercise.bind(this, exercise.id)}>Remove</button></td>
                      </tr>
                    ))
                    }
              </tbody>
            </table>
          ) : (<div />)}
        </div>
      </div>
    )
  }
}
