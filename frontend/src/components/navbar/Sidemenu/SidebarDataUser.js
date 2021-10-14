import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as HiIcons from 'react-icons/hi'
import * as CgIcons from 'react-icons/cg'
import * as MdIcons from 'react-icons/md'
import { GetName } from '../../auth'

export const SidebarDataUser = [
  {
    title: GetName(),
    path: '/profile',
    icon: <CgIcons.CgProfile />

  },
  {
    title: 'Calendar',
    path: '/',
    icon: <AiIcons.AiOutlineCalendar />
  },
  {
    title: 'Friends',
    path: '/requestlist',
    icon: <FaIcons.FaUserFriends />,
    subNav: [
      {
        title: 'Add Friends',
        path: "/findfriend"
      }

    ]
  },
  {
    title: 'Statistics',
    path: '/profile',
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
