import React, { useState, useEffect} from 'react';
import { GetToken, GetID } from "../auth"
import axios from 'axios';
import { VscAccount } from "react-icons/vsc";
import {
  Button,Table,Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle
} from 'reactstrap';
import './Friends.css'

function Friends (props) {
    
   const[RequestList,setRequestList]= useState([])
   const[FriendsList,setFriendsList]= useState([])
   const[selecteduser,setselecteduser]= useState('')
   const[selectedusername,setselectedusername] =useState('')
   const[showorange,setshoworangena]= useState([])
   const[FriendsListWithAccess,setFriendsListWithAccess]= useState([])
   const[FriendWaitingForAccess,setFriendWaitingForAccess]= useState([])
   const[hasaccess,sethasaccess]= useState('')
   const[haspendingaccess,sethaspendingaccess]= useState('')
   const[hasoutgoingpendingaccess,sethasoutgoingpendingaccess]=useState('')
   const[hasUpdated,sethasUpdated] =useState(false)
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


    console.log(showorange)
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
    {FriendWaitingForAccess.map(friend =>
      showorange.push(friend)
      )}
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
  ]).then(()=> {sethasUpdated(!hasUpdated)})
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
    }).then(()=> {sethasUpdated(!hasUpdated)})
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
    }).then(()=> {sethasUpdated(!hasUpdated)}),

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
    ]).then(()=> {sethasUpdated(!hasUpdated)})
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
    }).then(()=> {sethasUpdated(!hasUpdated)})
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
    

  function hasAccess(friendid){
    axios({
      method: 'get',
      url: '/api/hasaccess/'+friendid,
      headers: {
        'x-access-token': GetToken()
      },
    })
    .then(response => {
      sethasaccess(response.data.data[0])})

  }
  function hasPendingAccess(friendid){
   axios({
      method: 'get',
      url: '/api/haspendingacces/'+friendid,
      headers: {
        'x-access-token': GetToken()
      },
    })
    .then(response => {
      sethaspendingaccess(response.data.data[0])})
  }

  function hasOutgoingPendingAccess(friendid){
    axios({
       method: 'get',
       url: '/api/hasoutgoingpendingacces/'+friendid,
       headers: {
         'x-access-token': GetToken()
       },
     })
     .then(response => {
       sethasoutgoingpendingaccess(response.data.data[0])})
   }


   function setselecteduserid(selecteduser){
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
    {selecteduser && haspendingaccess['a']===1 ?(
      <div>
      <h5>🟠-Accept {selectedusername} request to view your trainingplan:</h5>
      <section class="basic-grid1">
      <Button
            color="success"
            onClick={() =>handleSubmitAcceptTP(selecteduser)}
          >Accept TP
        </Button>
      <Button
          color="danger"
          onClick={() =>handleSubmitDeclineTP(selecteduser)}
        >Decline TP 
      </Button>
      </section>
      </div>
    ): null }
    {selecteduser && hasoutgoingpendingaccess['a']===0 && hasaccess['a']===0 ?(
    <div>
    <h5>Ask to view {selectedusername} trainingplan</h5>
    <section class="basic-grid1">
    <Button
        color="primary"
        onClick={() =>handleAskforTP(selecteduser)}
      >Ask for TP
    </Button>
    </section>
    </div>): null }
    {selecteduser && hasaccess['a']===1 ?(
    <div>
    <h5>View {selectedusername} trainingplan:</h5>
    <section class="basic-grid1">
    
    <Button
      color="success"
      href="/friendcalendar/"
    >View Trainingplan
      </Button>
      </section></div>): null}
      
    {selecteduser ?(
    <div>
    <h5>Remove {selectedusername} from friends:</h5>
    <section class="basic-grid1">
    <Button
          color="danger"
          onClick={() =>handleSubmitDelete(selecteduser)}
          disabled={!selecteduser}
        >Remove
    </Button>
    </section></div>): null}


    <section class="basic-grid">
    {RequestList.map(user =>
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
      <Card>
      <CardBody>
      <CardTitle tag="h5"><VscAccount/>
      {showorange.find(wfriend=> wfriend.id===friend.id) ?
        friend.name +'🟠'
      : friend.name}
      
      </CardTitle>
        <CardSubtitle>{friend.email}</CardSubtitle>
        <Button
          color="primary"
          onClick={()=> {hasAccess(friend.id);hasPendingAccess(friend.id);hasOutgoingPendingAccess(friend.id);setselecteduser(friend.id);setselectedusername(friend.name);setselecteduserid(friend.id)}}
        >select
        </Button>
      </CardBody>
    </Card>)}
    </section>
    </div>

    );
}
export default Friends