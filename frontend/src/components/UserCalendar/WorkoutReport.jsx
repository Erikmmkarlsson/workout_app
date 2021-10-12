import axios from "axios";
import React, { useState, useEffect } from "react"
import { Button, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

const WorkoutReport = props => {
    const [eventId, setEventId] = useState(null)
    const [done, setDone] = useState(0)
    const [comment, setComment] = useState('')
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState('')
    const {toggleModal, selectedEvent} = props
    const toggle = () => setModal(!modal);

    /*
    useEffect(() => {
        
    }, [])
    */


    const handleMarkChange = e => {
        if(e.target.value === "complete"){
            setDone(1)
        }
        else{
            setDone(2)
        }
        const { value } = e.target;
        setSelected(value)
    };

    const handleCommentChange = e => {
        setComment(e.target.value)
    };

    const handleSubmit = () => {
        const data = {is_done:done, client_comment:comment}
        axios.patch('/api/workout_events/' + selectedEvent, data)
    }

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
                                onChange={handleMarkChange} />{' '}
                            Mark completed
                        </Label> </FormGroup>

                    <FormGroup>
                        <Label check>
                            <Input type="radio"
                                name="radio2"
                                id="incomplete"
                                value="incomplete"
                                onChange={handleMarkChange} />{' '}
                            Mark missed <br />
                        </Label></FormGroup>

                    {(selected === 'complete')
                        ? (<div>How did it go?</div>)
                        : null}

                    {(selected === 'incomplete')
                        ? (<div>What went wrong?</div>)
                        : null}

                    {selected !== '' ? (
                        <Input type="textarea" name="text" id="comment" value={comment} onChange={handleCommentChange}/>
                    ) : null}

                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => {toggle(); toggleModal(); handleSubmit()}}>Submit</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )

}

export default WorkoutReport
