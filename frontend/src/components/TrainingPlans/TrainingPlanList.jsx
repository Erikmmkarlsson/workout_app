import React, { useEffect, useState } from 'react'
import { GetToken } from '../auth'
import axios from 'axios';
const TrainingPlanList = props => {
  //const managerId = GetID();
  const [ users, setUsers ] = useState([]);
  const [currentIndex] = useState(-1)

  const { selectedUser, setSelectedUser } = props;

  console.log(selectedUser)

  useEffect(() => {
    axios.get('/api/manager/myUsers', {headers: {'x-access-token': GetToken()}}).then((response) => {
      setUsers(response.data.data)
    });
  }, []);



  return (
    <div>
      <ul className='list-group'>
          {users &&
            users.map((user, index) => (
              <li
                className={
                  'list-group-item ' + (index === currentIndex ? 'active' : '')
                }
                onClick={() => setSelectedUser(user.id)}
                key={index}
              >
                {user.name}
              </li>
            ))}
        </ul>
    </div>)
}

export default TrainingPlanList;