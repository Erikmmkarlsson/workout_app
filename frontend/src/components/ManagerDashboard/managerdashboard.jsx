import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Calendar from "../ManagerCalender"

export default function ManagerDashboard(props) {

  return (
    <div className="dashboard">
      <div style={{ textAlign: "center" }}>
      
        <Link to="/myusers">
          <button className="m-3 btn-sm btn-success">Clients</button>
        </Link>
        <Link to="/trainingplans">
          <button className="m-3 btn-sm btn-success">Training Plans</button>
        </Link>
        <Link to="/workouts">
          <button className="m-3 btn-sm btn-success">Workouts</button>
        </Link>
        <Link to="/exercises">
          <button className="m-3 btn-sm btn-success">Exercises</button>
        </Link>
      </div>
      <Calendar />

    </div>
  );
}
