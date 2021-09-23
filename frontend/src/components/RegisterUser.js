import React, {Component} from 'react';
import axios from 'axios';
import{
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';


export default class RegisterUser extends Component {
    state={
        modal: false,
        name:'',
        email:'',
        password:''
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })

    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = event =>{
        event.preventDefault();

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/user',
            data: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }}
            ).then(res =>{
            console.log(res);
            console.log(res.data);
        });
        

         this.toggle();

    }

    render(){
        return(
            <div>
                <Button
                    color="dark"
                    style={{marginBottom:'2rem'}}
                    onClick={this.toggle}
                >Register
                </Button>

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>
                        Register </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="item"></Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="item"
                                    placeholder="name"
                                    onChange={this.handleChange}
                                />
                                <Input
                                    type="text"
                                    name="email"
                                    id="item"
                                    placeholder="email"
                                    onChange={this.handleChange}
                                />
                                <Input
                                    type="text"
                                    name="password"
                                    id="item"
                                    placeholder="password"
                                    onChange={this.handleChange}
                                />
                                <Button disabled={this.state.name.length<1 ||this.state.email.length<1 ||this.state.password.length<6} color="dark" style={{marginTop:'2rem'}} block>Register</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }


}