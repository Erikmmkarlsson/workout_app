import React, { Component } from 'react';
import { GetToken, GetID } from "../auth"
import axios from 'axios';
import {
  Button,
  Table

} from 'reactstrap';
export default class AcceptFriends extends Component {

  state = {
    RequestList: [],
  };

  componentDidMount() {
    axios.get('/api/requestList/', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ RequestList: response.data.data })
    });
  }

  handleSubmit = event => {
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
  render() {
    return (
      <div className='AcceptUsers'>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
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
                    onClick={this.handleSubmit}
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