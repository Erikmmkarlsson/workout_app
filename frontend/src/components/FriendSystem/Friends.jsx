import React, { Component } from 'react';
import { GetToken, GetID } from "../auth"
import axios from 'axios';
import {
  Button,
  Table

} from 'reactstrap';
export default class Friends extends Component {

  state = {
    RequestList: [],
    FriendsList: []
  };

  componentDidMount() {
    axios.get('/api/requestList/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ RequestList: response.data.data })
    });
    axios.get('/api/FriendsList/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ FriendsList: response.data.data })
    });
  }

  handleSubmitAccept = event => {
    event.preventDefault();
    axios.all([
    axios({
      method: 'post',
      url: '/api/addtofriendslist/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: event.target.id
      }
    }),
    axios({
      method: 'delete',
      url: '/api/reqList/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: event.target.id
      }
    })
  ])
  }
  handleSubmitDelete = event => {
    event.preventDefault();
    axios({
      method: 'delete',
      url: '/api/removefriend/',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        id: event.target.id
      }
    })

  }
  render() {
    return (
      <div className='AcceptUsers'>
      <h4>Friends:</h4>
      <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.FriendsList.map(friend =>
              <tr>
                <td >{friend.name}</td>
                <td >{friend.email}</td>
                <td>
                  <Button
                    id={friend.id}
                    color="danger"
                    onClick={this.handleSubmitDelete}
                  >Remove
                  </Button>
                </td>
              </tr>)}

          </tbody>
        </Table>

        <h4 style={{marginTop: '5rem'}}>Incoming friend requests:</h4>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.RequestList.map(user =>
              <tr>
                <td >{user.name}</td>
                <td >{user.email}</td>
                <td>
                  <Button
                    id={user.id}
                    color="success"
                    onClick={this.handleSubmitAccept}
                  >Accept
                  </Button>
                </td>
              </tr>)}

          </tbody>
        </Table>
      </div>




    );
  }


}