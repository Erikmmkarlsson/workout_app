import React, {Component} from 'react';
import { authFetch} from "../auth"
import axios from 'axios';
import{
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    Alert,
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,

} from 'reactstrap';

function GetUsers(){
    authFetch('http://localhost:8000/api/manager/myUsers', {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
    })
}

export default class RegisterUser extends Component {
    state={
        users: []
 
    };

    componentDidMount() {
          GetUsers()
          .then(response => {
            this.setState({users: response.data.data})
          });
      }
    
    render(){
        return(
            <div>
                <ul>
                {this.state.users.map(user => <li>{user.name}</li>)}

                </ul>
                

            </div>

        );
    }
}