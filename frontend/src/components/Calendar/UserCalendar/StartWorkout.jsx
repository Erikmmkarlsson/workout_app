import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'reactstrap'

const StartWorkout = props => {
    const { exerciseList } = props
    const [currentExercise, setCurrentExercise] = useState()

    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)

    useEffect(() => {
        setCurrentExercise(exerciseList[0])
    }, [])

    console.log(currentExercise)
    console.log(exerciseList[0])
    return (
        <div>
            <Button onClick={toggle}>Start Workout</Button>
            <Modal isOpen={modal} toggle={toggle}>

            
            </Modal>
        </div>



    )
}


export default StartWorkout
