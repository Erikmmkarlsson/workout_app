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
            <div >
            <Navbar style={{backgroundImage:" radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% )"}} dark expand="sm" className="mb-5">
            <Container style={{fontSize:"1.5rem"}}>
                    <NavbarBrand style={{fontSize:"2.5rem"}} href="/">WorkOUT</NavbarBrand>
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