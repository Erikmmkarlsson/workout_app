import React from 'react'
import {
    FormGroup,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    Button,
    DropdownMenu
} from 'reactstrap'


const calendButtons = props => {
    const {
        dropdownOpenWorkouts,
        toggleWorkouts,
        selectedWorkoutName,
        workoutListDropdown,
        handleDropdownSelect,
        handleButton
    } = props

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
                                                overflow: 'auto',
                                                maxHeight: '100px'
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
                </FormGroup>
                <FormGroup>
                    {(selectedWorkoutName !== 'Select a Workout') ?(
                        <Button
                        color='primary'
                        onClick={() => handleButton()}
                        type='submit'
                    >
                        Add workout
                    </Button>
                    ): null}
                    
                </FormGroup>
            </div>
        </div>
    )
}


export default calendButtons
