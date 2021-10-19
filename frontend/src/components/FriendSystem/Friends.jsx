import React, { useState, useEffect} from 'react';
import { GetToken } from "../auth"
import axios from 'axios';
import { VscAccount } from "react-icons/vsc";
import {
  Button,Card, CardBody,CardTitle, CardSubtitle
} from 'reactstrap';
import './Friends.css'

function Friends (props) {
    
   const[requestList,setRequestList]= useState([])
   const[friendsList,setFriendsList]= useState([])
   const[selectedUser,setSelectedUser]= useState('')
   const[selectedUsername,setSelectedUsername] =useState('')
   const[showOrange,setShowOrange]= useState([])
   const[friendsListWithAccess,setFriendsListWithAccess]= useState([])
   const[friendWaitingForAccess,setFriendWaitingForAccess]= useState([])
   const[hasAccess,setHasAccess]= useState('')
   const[hasPendingAccess,setHasPendingAccess]= useState('')
   const[hasOutgoingPendingAccess,setHasOutgoingPendingAccess]=useState('')
   const[hasUpdated,setHasUpdated] =useState(false)
  useEffect(() =>{
    axios.get('/api/requestList/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      setRequestList(response.data.data)
    });
    axios.get('/api/FriendWaitingForAccess/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      setFriendWaitingForAccess(response.data.data)
    })
    axios.get('/api/FriendsList/', {
      headers: {
        'x-access-token': GetToken()
      }
    })
    .then(response => {
      setFriendsList(response.data.data)
    })


    console.log(showOrange)
    /*axios.get('/api/FriendsThatGaveMeAccess/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ FriendsListWithAccess: response.data.data })
    });
    axios.get('/api/FriendWaitingForAccess/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ FriendWaitingForAccess: response.data.data })
    });
    */
  },[hasUpdated])

  useEffect(()=>{
    friendWaitingForAccess.map(friend =>
      showOrange.push(friend)
      )
  })



  function handleSubmitAccept(friendid){
    axios.all([
    axios({
      method: 'post',
      url: '/api/addtofriendslist/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    }),
    axios({
      method: 'delete',
      url: '/api/reqList/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    })
  ]).then(()=> {setHasUpdated(!hasUpdated)})
}
  
  function handleSubmitDecline(friendid){
    axios({
      method: 'delete',
      url: '/api/reqList/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    }).then(()=> {setHasUpdated(!hasUpdated)})
  }
  function handleSubmitDelete(friendid){
    axios.all([
    axios({
      method: 'delete',
      url: '/api/removefriend/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    }),
    axios({
      method: 'delete',
      url: '/api/reqList/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    }).then(()=> {setHasUpdated(!hasUpdated)}),

  ])
 }
  function handleSubmitAcceptTP(friendid){
    axios.all([
    axios({
      method: 'delete',
      url: '/api/removependingaccess/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    }),
    axios({
      method: 'post',
      url: '/api/giveaccess/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    })
    ]).then(()=> {setHasUpdated(!hasUpdated)})
  }
  function handleSubmitDeclineTP(friendid){
    axios({
      method: 'delete',
      url: '/api/removependingaccess/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    }).then(()=> {setHasUpdated(!hasUpdated)})
  }
  
  function handleAskforTP(friendid){
    axios({
      method: 'post',
      url: '/api/pendingaccess/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: friendid
      }
    })
  }
    

  function getAccess(friendid){
    axios({
      method: 'get',
      url: '/api/hasaccess/'+friendid,
      headers: {
        'x-access-token': GetToken()
      },
    })
    .then(response => {
      setHasAccess(response.data.data[0])})

  }
  function getPendingAccess(friendid){
   axios({
      method: 'get',
      url: '/api/haspendingacces/'+friendid,
      headers: {
        'x-access-token': GetToken()
      },
    })
    .then(response => {
      setHasPendingAccess(response.data.data[0])})
  }

  function getOutgoingPendingAccess(friendid){
    axios({
       method: 'get',
       url: '/api/hasoutgoingpendingacces/'+friendid,
       headers: {
         'x-access-token': GetToken()
       },
     })
     .then(response => {
       setHasOutgoingPendingAccess(response.data.data[0])})
   }


   function setSelecteduserId(selecteduser){
    const data = {selecteduser: selecteduser}
    axios.patch('/api/selecteduser/', data, {
      headers: {
        'x-access-token': GetToken()
      }
    })
    console.log('patch doneee')
   }
  
  
  return (
  
    <div className='AcceptUsers'>
    <h4>Friends:</h4>
    {selectedUser && getPendingAccess['a']===1 ?(
      <div>
      <h5>🔵-Accept {selectedusername} request to view your trainingplan:</h5>
      <section class="basic-grid1">
      <Button
            color="success"
            onClick={() =>handleSubmitAcceptTP(selecteduser)}
          >Accept
        </Button>
      <Button
          color="danger"
          onClick={() =>handleSubmitDeclineTP(selecteduser)}
        >Decline 
      </Button>
      </section>
      </div>
    ): null }
    {selectedUser && getOutgoingPendingAccess['a']===0 && getAccess['a']===0 ?(
    <div>
    <h5>Ask to view {selectedUsername} trainingplan</h5>
    <section class="basic-grid1">
    <Button
        color="primary"
        onClick={() =>handleAskforTP(selectedUser)}
      >Ask for TP
    </Button>
    </section>
    </div>): null }
    {selectedUser && getAccess['a']===1 ?(
    <div>
    <h5>View {selectedUsername} trainingplan:</h5>
    <section class="basic-grid1">
    
    <Button
      color="success"
      href="/friendcalendar/"
    >View Trainingplan
      </Button>
      </section></div>): null}
      
    {selectedUser ?(
    <div>
    <h5>Remove {selectedUsername} from friends:</h5>
    <section class="basic-grid1">
    <Button
          color="danger"
          onClick={() =>handleSubmitDelete(selectedUser)}
          disabled={!selectedUser}
        >Remove
    </Button>
    </section></div>): null}


    <section class="basic-grid">
    {requestList.map(user =>
      <Card>
      <CardBody>
        <CardTitle tag="h5"><VscAccount/> {user.name}</CardTitle>
        <CardSubtitle>{user.email}</CardSubtitle>
        <Button
          id={user.id}
          color="success"
          onClick={() =>handleSubmitAccept(user.id)}
        >Accept
        </Button>
        <Button
          id={user.id}
          color="danger"
          onClick={() =>handleSubmitDecline(user.id)}
        >Decline
        </Button>
      </CardBody>
    </Card>)}
    {FriendsList.map(friend =>
      <Card
      outline color="primary"
      onClick={()=> {hasAccess(friend.id);hasPendingAccess(friend.id);hasOutgoingPendingAccess(friend.id);setselecteduser(friend.id);setselectedusername(friend.name);setselecteduserid(friend.id)}}>
      <CardBody className="crd-hover">
      <CardTitle tag="h5"><VscAccount/>
      {showorange.find(wfriend=> wfriend.id===friend.id) ?
        friend.name +'🔵'
      : friend.name}
      
      </CardTitle>
        <CardSubtitle>{friend.email}</CardSubtitle>
      </CardBody>
    </Card>)}
    </section>
    </div>

    );
}
export default Friends