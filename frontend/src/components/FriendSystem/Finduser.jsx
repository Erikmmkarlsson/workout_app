import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GetID ,GetToken} from '../auth'
import { Alert } from 'reactstrap';
import "./Finduser.css";
export default function Finduser(props) {
  const [usersList, setusersList] = useState([])
  const [currentuser, setCurrentuser] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [searchName, setSearchName] = useState('')
  const [reciever, setreciever]= useState('')
  const [requestList, setrequestList]= useState('')
  const [requestList2, setrequestList2]= useState('')
  const [warning, setwarning]= useState('')

  useEffect(() => {
    axios.get('/api/reqList',{
      headers: {
        'x-access-token': GetToken()
      }
    }).then((response) => {
      setusersList(response.data.data)
    })
  }, [])

  const handleChange = () => (e) => {
    setSearchName(e.target.value)
  }

  function setActiveuser(user, index) {
    setCurrentuser(user)
    setCurrentIndex(index)
    
  }

  function search() {
    axios.get('/api/reqList?search=' + searchName,{
      headers: {
        'x-access-token': GetToken()
      }
    }).then((response) => {
      setusersList(response.data.data)
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    if(requestList.length !==0)
    {
      setwarning('You already sent a request to selected user')
    }
    if(requestList2.length !==0)
    {
      setwarning('Selected user already sent you a request, go accept')
    }
    if(requestList.length === 0 && requestList2.length === 0 )
    {
      const request_data = { id_sender:GetID(), id_reciever:reciever }
      axios.post('/api/reqList', request_data)
      
      axios.get('/api/UserrequestList/'+GetID()+'/'+reciever 
      ).then(response => {setrequestList(response.data.data)
      });
      axios.get('/api/UserrequestList/'+reciever+'/'+GetID()
      ).then(response => {setrequestList2(response.data.data)
      });

    }
  }

  useEffect(() => {
    axios.get('/api/UserrequestList/'+GetID()+'/'+reciever 
    ).then(response => {setrequestList(response.data.data)
    });
    axios.get('/api/UserrequestList/'+reciever+'/'+GetID()
    ).then(response => {setrequestList2(response.data.data)
    });
  }, [reciever])

  

  

  return (
    <div className='Finduser'>
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
        <h4>users</h4>
        <ul className='list-group'>
          {usersList &&
            usersList.map((user, index) => (
              <li
                className={
                  'list-group-item ' + (index === currentIndex ? 'active' : '')
                }
                onClick={() => {setActiveuser(user, index); setreciever(user.id);}}
                key={index}
              >
                {user.name}
              </li>
            ))}
        </ul>
      </div>
      <div className='col-md-6'>
        {currentuser ? (
          <div>
            <h4>Information</h4>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{' '}
              {currentuser.name}
            </div>
            <div>
              <label>
                <strong>Email:</strong>
              </label>{' '}
              {currentuser.email}
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
      {warning? (
        <Alert color="warning">
         {warning}
        </Alert>)
      : (null)}
      


    </div>
  )     
}