import React, {Component} from 'react';
import  {GetToken} from "../auth"
import axios from 'axios';
import{
    Button,
    Table

} from 'reactstrap';

export default class RegisterUser extends Component {

    state={
        ActivatedUsers: [],
        WaitingList: []
 
    };
    
    componentDidMount() {
      axios.get('/api/manager/myUsers', {
      headers: {
        'x-access-token': GetToken()
      }
    }).then(response => {
      this.setState({ActivatedUsers: response.data.data})
     });

     axios.get('/api/manager/waitinglist', {
      headers: {
        'x-access-token':  GetToken()
      }
    }).then(response => {
      this.setState({WaitingList: response.data.data})
     });

    

    }
    handleSubmitActivate = event =>{
      event.preventDefault();
      axios({
          method: 'patch',
          url: '/api/user/'+event.target.id,
          data: {
              activated: true
          }}
          ).then(()=>window.location.reload(false));
          
    }
    handleSubmitDeactivate = event =>{
      event.preventDefault();
      axios({
          method: 'patch',
          url: '/api/user/'+event.target.id,
          data: {
              activated: false
          }}
          ).then(()=>window.location.reload(false));
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