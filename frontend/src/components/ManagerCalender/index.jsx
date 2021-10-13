import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { GetToken } from "../auth";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CalendarBody from "./CalendarBody";
import CalendarHead from "./CalendarHead";
import "./calendar.css";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Button,
  FormGroup,
  Modal,
} from "reactstrap";

function Calendar(props) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  /* HOOKS */

  // Later add hook for active days from database

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleWorkouts = () =>
    setDropdownOpenWorkouts((prevState) => !prevState);

  //States handling the user
  const [usersList, setUsersList] = useState([]);
  const [selectedUserTrainingplan, setSelectedUserTrainingplan] = useState({
    id: null,
    client_id: null,
    manager_id: null,
  });
  const [selectedUserName, setSelectedUserName] = useState("Select a client");
  const [dropdownOpenUsers, setDropdownOpen] = useState(false);

  //States handling the calendar and month dropdowntable
  const [dateObject, setdateObject] = useState(moment());
  const [showMonthTable, setShowMonthTable] = useState(false);
  const [selected, hasSelected] = useState(false);

  //States handling the dropdown menu selecting workouts and adding workouts
  const [workoutListDropdown, setWorkoutListDropdown] = useState([]);
  const [dropdownOpenWorkouts, setDropdownOpenWorkouts] = useState(false);
  const [selectedWorkoutName, setSelectedWorkoutName] =
    useState("Select a Workout");
  const [selectedWorkoutID, setSelectedWorkoutID] = useState("");
  

  //States handling the workouts that are connected to the user's training plan
  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({ id: 0 });
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState([]);

  const [added, hasAdded] = useState(false);

  useEffect(() => {
    axios
      .get("/api/manager/myUsers", {
        headers: {
          "x-access-token": GetToken(),
        },
      })
      .then((response) => {
        setUsersList(response.data.data);
      });
  }, []);

  function handleButton() {
    const data = {
      training_plan_id: selectedUserTrainingplan.id,
      workout_id: selectedWorkoutID,
      date: selectedDay.year + "-" + selectedDay.month + "-" + selectedDay.day,
      is_done: 0,
    };
    axios.post("api/AddWorkOutToUser", data);

    hasAdded(!added);
  }

  function handleSelect(selectedID, selectedName) {
    setSelectedUserName(selectedName);
    axios
      .get("/api/GetTrainingplanIdByClientID/" + selectedID, {
        headers: {
          "x-access-token": GetToken(),
        },
      })
      .then((response) => {
        setSelectedUserTrainingplan(response.data.data[0]);
        console.log(response.data);
      });
    axios
      .get("/api/UserWorkoutsByInput/" + selectedID, {
        headers: {
          "x-access-token": GetToken(),
        },
      })
      .then((response) => {
        setEventList(response.data.data);
      });
  }

  useEffect(() => {
    handleSelect(selectedUserTrainingplan.client_id, selectedUserName);
  }, [added]);

  const defaultSelectedDay = {
    day: moment().date(),
    month: moment().month(),
    year: moment().year(),
  };
  const [selectedDay, setSelected] = useState(defaultSelectedDay);

  /* CALENDAR HEAD */
  const allMonths = moment.months();
  const currentMonth = () => dateObject.format("MMMM");
  const currentYear = () => dateObject.format("YYYY");

  const setMonth = (month) => {
    const monthNo = allMonths.indexOf(month);
    let newDateObject = Object.assign({}, dateObject);
    newDateObject = moment(dateObject).set("month", monthNo);
    setdateObject(newDateObject);
    setShowMonthTable(false);
  };

  const toggleMonthSelect = () => setShowMonthTable(!showMonthTable);
  /** * CALENDAR BODY ***/
  const setSelectedDay = (day) => {
    setSelected({
      day,
      month: currentMonthNum(),
      year: currentYearNum(),
    });
    hasSelected(true);
  };

  function OpenLink(link) {
    window.open(link);
  }

  function handleDropdownSelect(WorkoutId, WorkoutName) {
    setSelectedWorkoutID(WorkoutId);
    setSelectedWorkoutName(WorkoutName);
  }
  const currentMonthNum = () => dateObject.month() + 1;
  const currentYearNum = () => dateObject.year();
  const daysInMonth = () => dateObject.daysInMonth();
  const currentDay = () => moment().date();
  const actualMonthNum = () => moment().month() + 1;
  const actualYear = () => moment().format("YYYY");
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const firstDayOfMonth = () => moment(dateObject).startOf("month").format("d");
  
  const ActiveDates = [];
  for (const workout of eventList) {
    ActiveDates.push({
      date: workout.date,
      id: workout.id,
      is_done: workout.is_done,
    });
  }
  console.log(ActiveDates);
  return (
    <div className="calend">
      <Container disableGutters="false">
        <Grid container>
          <Grid item xs={8} md={20} lg={30}>
            <Dropdown
              style={{ marginTop: "1rem", width: "100%" }}
              group
              isOpen={dropdownOpenUsers}
              toggle={toggle}
            >
              <DropdownToggle
                caret
                style={{ marginTop: "1rem", width: "100%" }}
              >
                {selectedUserName}
              </DropdownToggle>
              <DropdownMenu style={{ marginTop: "1rem", width: "100%" }}>
                {usersList.map((User) => (
                  <DropdownItem
                    onClick={() => handleSelect(User.id, User.name)}
                  >
                    {User.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {selectedUserTrainingplan ? (
            <CalendarHead
              allMonths={allMonths}
              currentMonth={currentMonth}
              currentYear={currentYear}
              setMonth={setMonth}
              showMonthTable={showMonthTable}
              toggleMonthSelect={toggleMonthSelect}
            />
            ) : null }
            {(!showMonthTable && selectedUserTrainingplan) ? (
              <CalendarBody
                firstDayOfMonth={firstDayOfMonth}
                daysInMonth={daysInMonth}
                currentDay={currentDay}
                currentMonth={currentMonth}
                currentMonthNum={currentMonthNum}
                currentYear={currentYear}
                currentYearNum={currentYearNum}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                actualMonthNum={actualMonthNum}
                actualYear={actualYear}
                weekdays={weekdays}
                ActiveDates={ActiveDates}
                SelectedUserID={selectedUserTrainingplan.client_id}
                setSelectedWorkoutExercises={setSelectedWorkoutExercises}
                setWorkoutListDropdown={setWorkoutListDropdown}
                added={added}
                toggleModal={toggleModal}
                setSelectedEvent={setSelectedEvent}
              />
            ) : <div><br /><br /><br /><br /></div>}
            {selected ? (
              <div>
                <div class="calendButtons">
                  <FormGroup>
                    <Dropdown
                      group
                      isOpen={dropdownOpenWorkouts}
                      toggle={toggleWorkouts}
                    >
                      <DropdownToggle color="secondary" caret>
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
                                  overflow: "auto",
                                  maxHeight: "100px",
                                },
                              };
                            },
                          },
                        }}
                      >
                        {workoutListDropdown.map((Workout) => (
                          <DropdownItem
                            onClick={() =>
                              handleDropdownSelect(Workout.id, Workout.name)
                            }
                          >
                            {Workout.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="success"
                      onClick={() => handleButton()}
                      type="submit"
                    >
                      Add workout
                    </Button>
                  </FormGroup>
                </div>
                <Modal isOpen={modal} toggle={toggleModal}>
                  <Table
                    hover
                    style={{
                      background: "white",
                      marginTop: "1rem",
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Sets</th>
                        <th>reps</th>
                        <th>Video</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedWorkoutExercises.map((workout) => (
                        <tr>
                          <td>{workout.name}</td>
                          <td>{workout.num_sets}</td>
                          <td>{workout.num_reps}</td>
                          <td>
                            <Button
                              color="primary"
                              onClick={() => OpenLink(workout.video_link)}
                            >
                              Video
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Modal>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Calendar;
