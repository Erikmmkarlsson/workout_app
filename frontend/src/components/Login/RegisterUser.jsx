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
    Input,
    Alert,
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,

} from 'reactstrap';


export default class RegisterUser extends Component {

    state={
        modal: false,
        DropDown: false,
        IsValidName: true,
        IsValidEmail: true,
        EmailMatches:true,
        IsValidPassword: true,
        PasswordMatches: true,
        name:'',
        email:'',
        confirm_email:'',
        password:'',
        confirm_password:'',
        managerId:'',
        manager:'',
        managers:[],
        registered: false
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }
    toggle2 = () => {
        this.setState({
            DropDown: !this.state.DropDown
        })

    }
    toggle3 = (managerId, manager) => {
        this.setState({
            managerId: managerId,
            manager: manager

        })

    }
    
    
    handleChange = (event) => {
     
        if (typeof event.target.value !== "undefined") {
            if(event.target.name==='name'){
                if(event.target.value.length<3){
                    this.setState({
                        IsValidName: false, 
                    })
      
                }
                else{
                    this.setState({
                        IsValidName: true,
                    })
                    this.setState({[event.target.name]: event.target.value});
                }
      
           
            } 
            if(event.target.name==='email')
            {
                var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    
                if (!pattern.test(event.target.value)) {
                    this.setState({
                        IsValidEmail: false,
                    })
                }
                else{
                    this.setState({
                        EmailMatches: false,
                        IsValidEmail: true,
                    })
                    this.setState({[event.target.name]: event.target.value});
                }

            }
            if(event.target.name==='confirm_email')
            {
                if (event.target.value !== this.state.email) {
                    this.setState({
                        EmailMatches: false,
                    })
                }
                else{
                    this.setState({
                        EmailMatches: true,
                    })
                    this.setState({[event.target.name]: event.target.value});
                }

            }
            if(event.target.name==='password'){
                if(event.target.value.length<6){
                    this.setState({
                        IsValidPassword: false, 
                    })
      
                }
                else{
                    this.setState({
                        IsValidPassword: true,
                        PasswordMatches: false,
                    })
                    this.setState({[event.target.name]: event.target.value});
                }
            }
            if(event.target.name==='confirm_password')
            {
                if (event.target.value !== this.state.password) {
                    this.setState({
                        PasswordMatches: false,
                    })
                }
                else{
                    this.setState({
                        PasswordMatches: true,
                    })
                    this.setState({[event.target.name]: event.target.value});
                }

            }
        }
    }

    handleSubmit = event =>{
        event.preventDefault();
        console.log("handlesubmit");

        axios({
            method: 'post',
            url: '/api/register',
            data: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                manager: this.state.managerId,
                role: 'user'
            }}
            ).then(res =>{
            console.log(res);
            console.log(res.data);
           
        }).then(()=>{

        
        this.setState({
        IsValidName: true,
        IsValidEmail: true,
        EmailMatches: true,
        IsValidPassword: true,
        PasswordMatches: true,
        registered: true
            
        })
        this.setState(this.toggle)
        } );
         
         

    }

    componentDidMount() {
        axios.get(`/api/managers`)
          .then(response => {
            this.setState({managers: response.data.data})
          });
      }
    
    render(){
        return(
            <div>
                <Button
                    style={{margin: '1rem 0', width:"100%"}}
                    onClick={this.toggle}
                >
                Create an account
                </Button>

                {this.state.registered ? (
              <Alert color='success'>
                Registered successfully, please wait for your trainer to accept your application 
                before you can login
              </Alert>) : (null)}

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>
                        Register </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="name">Enter Name:</Label>
                                <Input 
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="name"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <Row>
                            <Col>
                            <FormGroup>
                                <Label for="email">Enter Email:</Label>
                                <Input 
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="email"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            </Col>
                            <Col>
                            <FormGroup>
                                <Label for="cEmail">Confirm Email:</Label>
                                <Input
                                    type="text"
                                    name="confirm_email"
                                    id="cEmail"
                                    placeholder="confirm email"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            </Col>
                            </Row> 
                            <Row>
                            <Col>
                            <FormGroup>
                                <Label for="password">Enter Password:</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    onChange={this.handleChange}
                                    
                                />
                            </FormGroup>
                            </Col>
                            <Col>
                            <FormGroup>
                                <Label for="cPassword">Confirm Password:</Label>
                                <Input
                                    type="password"
                                    name="confirm_password"
                                    id="cPassword"
                                    placeholder="confirm password"
                                    onChange={this.handleChange}
                                    
                                />
                            </FormGroup>
                            </Col>
                            </Row>
                            <br/>
                            Choose a trainer...
                            <Row>
                            <Dropdown group isOpen={this.state.DropDown}  style={{marginTop:"1rem", width:"10rem"}} toggle={this.toggle2}>
                            <DropdownToggle caret>
                               {this.state.manager}
                            </DropdownToggle>
                            <DropdownMenu>
                               {this.state.managers.map(manager => <DropdownItem onClick={() => this.toggle3(manager.id, manager.name)}>{manager.name}</DropdownItem>)} 
                            </DropdownMenu>
                            </Dropdown>
                            </Row>
                            <Row>
                            <Button disabled={this.state.name.length<3 || 
                                              this.state.email.length<6||
                                              this.state.password.length<6||
                                              !this.state.IsValidEmail || 
                                              !this.state.IsValidPassword|| 
                                              !this.state.IsValidName || 
                                              !this.state.EmailMatches || 
                                              !this.state.PasswordMatches
                                              } color="primary" style={{marginTop:'2rem'}} block>Register</Button>
                            </Row> 
                        </Form>
                    </ModalBody>
                    {!this.state.IsValidName ? (
                        <Alert color='danger'>
                            The name must be 3+ characters long
                        </Alert>
                    ):(null)}
                    {!this.state.IsValidEmail ? (
                        <Alert color='danger'>
                            The email is invalid
                        </Alert>
                    ):(null)}
                    {!this.state.EmailMatches ? (
                        <Alert color='danger'>
                            The email does not match
                        </Alert>
                    ):(null)}
                    {!this.state.IsValidPassword ? (
                        <Alert color='danger'>
                            The password must be 6+ characters long
                        </Alert>
                    ):(null)}
                    {!this.state.PasswordMatches ? (
                        <Alert color='danger'>
                            The password does not match
                        </Alert>
                    ):(null)}
                    
                </Modal>
                

            </div>

        );
    }


}