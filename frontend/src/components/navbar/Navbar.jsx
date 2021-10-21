import React, { useState } from 'react'
import './navbar.css'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div>
      <Navbar color='light' light expand='md' style={{zIndex:"100"}}>
        <NavbarBrand href='/' className='title'>Gymific</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='mr-auto' navbar>
            <NavItem>
              <NavLink href='/'>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='https://github.com/Erikmmkarlsson/workout_app'>GitHub</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/login'>Log in</NavLink>
            </NavItem>

          </Nav>

        </Collapse>
      </Navbar>
    </div>
  )
}

export default Example
