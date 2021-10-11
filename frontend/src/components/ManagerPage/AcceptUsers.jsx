import React, { Component } from 'react';
import { GetToken, GetID } from "../auth"
import axios from 'axios';
import {
  Button,
  Table

} from 'reactstrap';
import './AcceptUsers.css'
export default class RegisterUser extends Component {

  state = {
    ActivatedUsers: [],
    WaitingList: [],
    manager_id: GetID()


  };

  componentDidMount() {
    axios.get('/api/manager/myUsers', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ ActivatedUsers: response.data.data })
    });

    axios.get('/api/manager/waitinglist', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ WaitingList: response.data.data })
    });



  }
  handleSubmitActivate = event => {
    event.preventDefault();
    axios({
      method: 'patch',
      url: '/api/users/' + event.target.id,
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        activated: true
      }
    }
    )
    axios({
      method: 'post',
      url: '/api/training_plans',
      headers: {
        'x-access-token': GetToken()
      },
      data: {
        client_id: event.target.id,
        manager_id: this.state.manager_id
      }
    }
    ).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);

    }).then(() =>
    this.componentDidMount()
    );
  }
  handleSubmitDeactivate = event => {
    event.preventDefault();
    axios({
      method: 'patch',
      url: '/api/users/' + event.target.id,
      data: {
        activated: false
      }
    }
    ).then(() => this.componentDidMount());
  }

  render() {
    return (
      <div className='AcceptUsers'>
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.WaitingList.map(user =>
              <tr>
                <td >{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    id={user.id}
                    color="success"
                    onClick={this.handleSubmitActivate}
                  >Activate
                  </Button>
                </td>
              </tr>)}

          </tbody>
        </Table>
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.ActivatedUsers.map(user =>
              <tr>
                <td >{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    id={user.id}
                    color="danger"
                    onClick={this.handleSubmitDeactivate}
                  >Deactivate
                  </Button>
                </td>
              </tr>)}

          </tbody>
        </Table>
      </div>




    );
  }


}