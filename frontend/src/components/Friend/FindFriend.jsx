import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GetID } from '../auth'

export default function FindFriend(props) {
  const [friendsList, setFriendsList] = useState([])
  const [currentFriend, setCurrentFriend] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [searchName, setSearchName] = useState('')
  const [reciever, setreciever]= useState('')

  useEffect(() => {
    axios.get('/api/friends').then((response) => {
      setFriendsList(response.data.data)
    })
  }, [])

  const handleChange = () => (e) => {
    setSearchName(e.target.value)
  }

  function setActiveFriend(friend, index) {
    setCurrentFriend(friend)
    setCurrentIndex(index)
    
  }

  function search() {
    axios.get('/api/friends?search=' + searchName).then((response) => {
      setFriendsList(response.data.data)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const request_data = { id_sender:GetID(), id_reciever:reciever }
    await axios.post('/api/friends', request_data)
  }

  return (
    <div className='list row'>
      <Link to='/'>
        <button className='m-3 btn-sm btn-warning'>Return to dashboard</button>
      </Link>
      <div className='col-md-8'>
        <div className='input-group mb-3'>
          <input
            type='text'
            className='form-control'
            placeholder='Search by name'
            value={searchName}
            onChange={handleChange('searchName')}
          />
          <div className='input-group-append'>
            <button
              className='btn btn-outline-secondary'
              type='button'
              onClick={search}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className='col-md-6'>
        <h4>Friends</h4>
        <ul className='list-group'>
          {friendsList &&
            friendsList.map((friend, index) => (
              <li
                className={
                  'list-group-item ' + (index === currentIndex ? 'active' : '')
                }
                onClick={() => {setActiveFriend(friend, index); setreciever(friend.id);}}
                key={index}
              >
                {friend.name}
              </li>
            ))}
        </ul>
      </div>
      <div className='col-md-6'>
        {currentFriend ? (
          <div>
            <h4>Information</h4>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{' '}
              {currentFriend.name}
            </div>
            <div>
              <label>
                <strong>Email:</strong>
              </label>{' '}
              {currentFriend.email}
            </div>
            <button
              onClick={handleSubmit}
              className='btn btn-warning'
              type='button'
              style={{ marginTop: 25 }}
            >
              Send request
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on an Name...</p>
          </div>
        )}
      </div>

    </div>
  )     
}