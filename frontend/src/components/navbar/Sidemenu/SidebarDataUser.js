import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as HiIcons from 'react-icons/hi'
import * as CgIcons from 'react-icons/cg'
import * as MdIcons from 'react-icons/md'

export const SidebarDataUser = [
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
    title: 'Profile',
    path: '/profile',
    icon: <CgIcons.CgProfile />

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
