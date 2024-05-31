import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapIcon from '@mui/icons-material/SwapVertRounded';

export const pages = [
    // { 
    //     id: 1, 
    //     label: "Dashboard", 
    //     icon: "home",
    //     link: "/dashboard"
    // },
    { 
        id: 2, 
        label: "Lesson Library", 
        icon: "grid_view",
        link: "/lesson-library"
    }, 
    { 
        id: 3, 
        label: "Core Concepts", 
        icon: "play_circle_filled",
        link: "/lesson-vault" 
    },
    { 
        id: 4, 
        label: "Parent Portal", 
        icon: "settings",
        link: "/parentportal" 
    }
]

export const settings = [
    {
        id:1, 
        label:"Edit Avatar", 
        icon: <EditIcon fontSize='small'/>
    }, 
    {
        id:2, 
        label:"Switch Profile", 
        icon: <SwapIcon fontSize='small'/>
    }, 
    {
        id:3, 
        label: "Logout", 
        icon: <LogoutIcon fontSize='small' />
    }
];