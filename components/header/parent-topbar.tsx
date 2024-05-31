import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Stack, IconButton, Menu, MenuItem, Icon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Router from 'next/router';
import { logout, parentLogout } from '../../store/slices/userSlice';
import { ExitToAppRounded, Logout } from '@mui/icons-material';
import { getParentById } from '../../store/thunk/parentThunk';
import { ApolloClientType } from '../../store/Interface';
import AddStudentPopup from '../model/add-student-popup';
import UserSubscribeModel from '../model/user-subscribe-model';

export const buttonMenu = [
    {
        id: 1,
        label: "Enter Learning Portal",
        icon: <ExitToAppRounded />,
    },
    {
        id: 2,
        label: "Logout",
        icon: <Logout />,
    },
]

export default function ParentTopbar() {
    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)
    const { parentProfileData } = useAppSelector((state) => state.parentReducer)

    const [parentName, setParentName] = React.useState<string>("");
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [openStudetProfileModel, setOpenStudetProfileModel] = React.useState<boolean>(false);
    const [openUserSubscribeModel, setOpenUserSubscribeModel] = React.useState<boolean>(false);
    const [isUserSubscribe, setIsUserSubscribe] = React.useState<boolean>(false);

    React.useEffect(() => {
        dispatch(getParentById({ _request: "", client: userClient }));
    }, [])

    React.useEffect(() => {
        if (parentProfileData && Object.keys(parentProfileData).length > 0) {
            setParentName(parentProfileData ? `${parentProfileData.first_name} ${parentProfileData.last_name} - ` : "");
            if (Array.isArray(parentProfileData.subscription_detail) && parentProfileData.subscription_detail.length > 0) {
                setIsUserSubscribe(true)
            } else {
                setIsUserSubscribe(false)
            }
        }
    }, [parentProfileData]);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleMenuItemClick = (id: number) => {
        if (id === 1) {
            handleEnterToLearningPortal()
        } else if (id === 2) {
            handleParentLogout()
        }
        handleCloseNavMenu()
    };

    const toggleStudentProfile = () => {
		setOpenStudetProfileModel(!openStudetProfileModel);
	}

    const toggleUserSubscribe = () => {
		setOpenUserSubscribeModel(!openUserSubscribeModel);
	}

    const handleEnterToLearningPortal = () => {
        let isChild = localStorage.getItem("is_child");

        if (isChild && isChild == "true") {
            dispatch(parentLogout());
            Router.replace("/select-profile");
        } else {
            if (isUserSubscribe) {
                toggleStudentProfile();
            } else {
                toggleUserSubscribe();
            }
            // Router.replace("/")
        }
    }

    const handleParentLogout = () => {
        Router.replace("/parent-logout");
    }

    return (
        <>
            <AppBar position="static">
                <Box sx={{ mx: 2, minHeight: { md: "75px", xs: "auto" } }}>
                    <Toolbar disableGutters sx={{ minHeight: { md: "75px", sm: "64px", xs: "60px" } }}>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="p"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'flex' },
                                    fontSize: { xs: "16px", sm: "18px" }
                                }}
                            >
                                {parentName}Parent Portal
                            </Typography>
                            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                                <div>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit">
                                        <MenuIcon />
                                    </IconButton>
                                </div>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', sm: 'none' },
                                        textAlign: "center"
                                    }}
                                >
                                    {buttonMenu.map((menu) => (
                                        <MenuItem key={menu.id} onClick={() => handleMenuItemClick(menu.id)}>
                                            {menu.icon}
                                            <Typography variant='subtitle2' textAlign="center" sx={{ ml: 1 }}>
                                                {menu.label}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                    {/* {buttonMenu.map((item) => (
                                    <div key={item.id}>
                                        <MenuItem
                                            key={item.id}
                                            onClick={() => Router.replace(item.link)}>
                                            <Typography textAlign="center">{item.label}</Typography>
                                        </MenuItem>
                                    </div>
                                ))} */}
                                </Menu>
                            </Box>
                            <Stack direction={"row"} spacing={1} sx={{ display: { xs: 'none', sm: "flex" } }}>
                                <Button
                                    variant='text'
                                    startIcon={<ExitToAppRounded />}
                                    className='exit-portal'
                                    onClick={handleEnterToLearningPortal}>
                                    Enter Learning Portal
                                </Button>

                                <Button
                                    variant='text'
                                    startIcon={<ExitToAppRounded />}
                                    className='exit-portal'
                                    onClick={handleParentLogout}>
                                    Logout
                                </Button>
                            </Stack>
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar >
            {
                !isUserSubscribe && openUserSubscribeModel &&
                <UserSubscribeModel
                    open={openUserSubscribeModel}
                    onClose={toggleUserSubscribe} />
            }
            {
                isUserSubscribe && openStudetProfileModel &&
                <AddStudentPopup
                    open={openStudetProfileModel}
                    onClose={toggleStudentProfile} />
            }
        </>
    )

}