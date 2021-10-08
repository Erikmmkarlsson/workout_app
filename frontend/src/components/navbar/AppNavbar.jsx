import React, { Component} from 'react';
import{
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';
import { GetID } from '../../components/auth'
class AppNavbar extends Component{
    state = {
        isOpen: false,
        id: GetID()
    }
    toggle = () =>{
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render(){
        return(
            <div >
            <Navbar style={{backgroundImage:" radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% )"}} dark expand="sm" className="mb-5">
            <Container style={{fontSize:"1.5rem"}}>
                    <NavbarBrand style={{fontSize:"2.5rem"}} href="/">Gymific</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen ={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="">
                                    Training Plans
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={`/editprofile/${this.state.id}`}>
                                    Profile
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/login">
                                    Log Out
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>

            </Navbar>
        </div>

        );
        
    }
}



export default AppNavbar;