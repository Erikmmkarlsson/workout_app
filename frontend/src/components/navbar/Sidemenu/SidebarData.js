import React from 'react'
import * as FaIcons from 'react-icons/fa'
import { AiOutlineCalendar } from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as HiIcons from 'react-icons/hi'
import * as CgIcons from 'react-icons/cg'
import * as BsIcons from 'react-icons/bs'
import * as GiIcons from 'react-icons/gi'
import * as MdIcons from 'react-icons/md'
import { GetName } from '../../auth'

export const SidebarData = [
  {
    title: GetName(),
    path: '/profile',
    icon: <CgIcons.CgProfile />

  },
  {
    title: 'Calendar',
    path: '/',
    icon: <AiOutlineCalendar />
  },
  {
    title: 'Clients',
    path: '/myusers',
    icon: <BsIcons.BsFillPersonCheckFill />
  },
  {
    title: 'Training Plans',
    path: '/trainingplans',
    icon: <FaIcons.FaCalendarCheck />
  },
  {
    title: 'Workouts',
    path: '/workouts',
    icon: <GiIcons.GiGymBag />
  },
  {
    title: 'Exercises',
    path: '/exercises',
    icon: <CgIcons.CgGym />
  },
  {
    title: 'Statistics',
    path: '/statistics',
    icon: <MdIcons.MdQueryStats />

  },
  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />
  },
  {
    title: 'Log Out',
    path: '/login',
    icon: <HiIcons.HiOutlineLogout />
  }
]
