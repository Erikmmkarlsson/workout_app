import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import TrainingPlanList from "../TrainingPlans/TrainingPlanList";
import Calendar from "../Calendar"

export default function ManagerDashboard(props) {
  const [ selectedUser, setSelectedUser ] = useState(null);

  return (
    <div className="dashboard">
      <div>
        
        <Link to="/myusers">
          <button className="m-3 btn-sm btn-success">Clients</button>
        </Link>
        <Link to="/workouts">
          <button className="m-3 btn-sm btn-success">Workouts</button>
        </Link>
        <Link to="/exercises">
          <button className="m-3 btn-sm btn-success">Exercises</button>
        </Link>
        <TrainingPlanList selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
      </div>
      <div>
        <Calendar />
      </div>
    </div>
  );
}
