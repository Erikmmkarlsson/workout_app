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

class AppNavbar extends Component{
    state = {
        isOpen: false
    }
    toggle = () =>{
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render(){
        return(
            <div>
            <Navbar color = "primary" dark expand="sm" className="mb-5">
            <Container>
                    <NavbarBrand href="/">WorkOUT</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen ={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="">
                                    Current Plans
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="">
                                    Create Plan
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="">
                                    Settings
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