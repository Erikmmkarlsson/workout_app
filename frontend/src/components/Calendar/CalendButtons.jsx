import React, { useState } from 'react'
import axios from 'axios'
import {
    FormGroup,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
    DropdownMenu
} from 'reactstrap'
import { GetRole } from '../auth'



const calendButtons = props => {
    const {
        dropdownOpenWorkouts,
        toggleWorkouts,
        selectedWorkoutName,
        workoutListDropdown,
        handleDropdownSelect,
        selectedUserTrainingplan,
        selectedWorkoutID,
        selectedDay,
        hasAdded,
        added
    } = props

    const [comment, setComment] = useState('')


    function handleButton() {
        const data = {
            training_plan_id: selectedUserTrainingplan.id,
            workout_id: selectedWorkoutID,
            date: selectedDay.year + '-' + selectedDay.month + '-' + selectedDay.day,
            is_done: 0,
            manager_comment: comment
        }
        axios.post('api/workout_events', data)

        hasAdded(!added)
    }

    const handleCommentChange = (e) => {
        //Handles when user enters a comment, updates variable
        setComment(e.target.value)
    }

    return (
        <div>

            <div class='calendButtons'>
                <FormGroup>
                    <Dropdown
                        group
                        isOpen={dropdownOpenWorkouts}
                        toggle={toggleWorkouts}
                    >
                        <DropdownToggle caret>
                            {selectedWorkoutName}
                        </DropdownToggle>
                        <DropdownMenu
                            modifiers={{
                                setMaxHeight: {
                                    enabled: true,
                                    order: 890,
                                    fn: (data) => {
                                        return {
                                            ...data,
                                            styles: {
                                                ...data.styles,
                                                overflow: 'hidden',
                                                maxHeight: '200px'
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            {workoutListDropdown.map((workout) => (
                                <DropdownItem
                                    onClick={() => handleDropdownSelect(workout.id, workout.name)}
                                >
                                    {workout.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    {(GetRole() === 'manager') ? (
                        <Input
                            type='textarea'
                            name='text'
                            id='comment'
                            placeholder='Add a helpful comment...'
                            onChange={handleCommentChange}
                            value={comment}
                            style={{ margin: '1rem 0rem' }}
                        />) : null}
                </FormGroup>
                <FormGroup>
                    {(selectedWorkoutName !== 'Select a Workout') ? (
                        <Button
                            color='success'
                            onClick={() => {
                                handleButton()

                            }}
                            type='submit'
                        >
                            Add workout
                        </Button>
                    ) : null}

                </FormGroup>
            </div>
        </div>

    )
}


export default calendButtons
