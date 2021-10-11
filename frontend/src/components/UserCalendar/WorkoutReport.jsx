import React, { useState } from "react"
import { Button, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
const WorkoutReport = props => {
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState('')
    const {toggleModal} = props
    const toggle = () => setModal(!modal);

    const handleChange = e => {
        const { value } = e.target;

        setSelected(value)

    };
    return (
        <div className="report">
            <Button onClick={toggle} color="success">Complete workout</Button>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>How did it go?</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label check>
                            <Input type="radio"
                                name="radio2"
                                id="complete"
                                value="complete"
                                onChange={handleChange} />{' '}
                            Mark completed
                        </Label> </FormGroup>

                    <FormGroup>
                        <Label check>
                            <Input type="radio"
                                name="radio2"
                                id="incomplete"
                                value="incomplete"
                                onChange={handleChange} />{' '}
                            Mark missed <br />
                        </Label></FormGroup>

                    {(selected === 'complete')
                        ? (<div>How did it go?</div>)
                        : null}

                    {(selected === 'incomplete')
                        ? (<div>What went wrong?</div>)
                        : null}

                    {selected !== '' ? (
                        <Input type="textarea" name="text" id="exampleText" />
                    ) : null}

                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => {toggle(); toggleModal()}}>Submit</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )

}

export default WorkoutReport
