import React, {Component} from 'react';
import  {authFetch} from "../auth"
import axios from 'axios';
import{
    Button,
    Table

} from 'reactstrap';

/*function GetUsers(){
    authFetch('http://localhost:8000/api/manager/myUsers', {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        console.log(data)
    })
}*/

export default class RegisterUser extends Component {

    state={
        ActivatedUsers: [],
        WaitingList: []
 
    };
    
    componentDidMount() {


      const key = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
      const parsedKey = JSON.parse(key);
      const token = parsedKey.token;
      console.log(token)
      axios.get('http://localhost:8000/api/manager/myUsers', {
      headers: {
        'x-access-token': token
      }
    }).then(response => {
      this.setState({ActivatedUsers: response.data.data})
     });

     axios.get('http://localhost:8000/api/manager/waitinglist', {
      headers: {
        'x-access-token':  token
      }
    }).then(response => {
      this.setState({WaitingList: response.data.data})
     });

    

    }
    handleSubmitActivate = event =>{
      event.preventDefault();
      axios({
          method: 'patch',
          url: 'http://localhost:8000/api/user/'+event.target.id,
          data: {
              activated: true
          }}
          );
          window.location.reload(false);
          
    }
    handleSubmitDeactivate = event =>{
      event.preventDefault();
      axios({
          method: 'patch',
          url: 'http://localhost:8000/api/user/'+event.target.id,
          data: {
              activated: false
          }}
          );
          window.location.reload(false);
    }

    render(){
        return(
          <div>
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