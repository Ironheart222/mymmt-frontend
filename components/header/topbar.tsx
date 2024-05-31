import * as React from 'react';
import { Icon, Avatar, MenuItem, Tooltip, Menu, AppBar, IconButton, Button, Box, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Router from "next/router";
import { pages, settings } from "./menu";
import AccountSettingsModel from '../model/child-account-setting';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getSingleChildInfo } from '../../store/thunk/childThunk';
import { ApolloClientType, ChildParam } from '../../store/Interface';
import { userLogout } from '../../helpers/helper';
import { logout, parentLogout } from '../../store/slices/userSlice';

interface Props {
    id: number | null;
}

export default function Topbar(props: Props) {
    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
    const { childData } = useAppSelector((state) => state.childReducer);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [isActive, setIsActive] = React.useState(1);
    const [openParentSetting, setOpenParentSetting] = React.useState(false);
    const [openAcountSetting, setOpenAccountSetting] = React.useState(false);
    const [childDetails, setChildDetails] = React.useState<Partial<ChildParam>>({
        child_name: "",
        profile_image_url: ""
    });

    React.useEffect(() => {
        let child_id = localStorage.getItem("child_id") ? localStorage.getItem("child_id") : null
        if (child_id) {
            dispatch(getSingleChildInfo({ _request: Number(child_id), userClient }))
        }
    }, []);

    React.useEffect(() => {
        if (props.id) {
            setIsActive(props.id);
        }
    }, [props])

    React.useEffect(() => {
        if (childData) {
            setChildDetails({
                child_name: childData?.child_name,
                profile_image_url: childData?.profile_image_url
            });

            let profileUrl = localStorage.getItem("profile_pic");

            if (profileUrl && profileUrl != null) {
                localStorage.setItem(
                    "profile_pic",
                    profileUrl);
            } else {
                localStorage.setItem(
                    "profile_pic",
                    childData.profile_image_url ? childData.profile_image_url : "");
            }
        }
    }, [childData]);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleMenuClick = (id: number, link: string) => {
        setIsActive(id);
        Router.push(link);
    }
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuItemClick = (id: number) => {
        if (id === 1) {
            setOpenAccountSetting(true)
        } else if (id === 2) {
            let child_id = localStorage.getItem("child_id") ? localStorage.getItem("child_id") : null
            if (child_id) {
                localStorage.setItem("last-selected-child", child_id)
            }
            localStorage.removeItem("child_id");
            window.location.replace("/select-profile");
            // Router.replace("/select-profile")
        } else if (id === 3) {
            dispatch(logout());
            dispatch(parentLogout());
            Router.replace("/");
        }
        handleCloseUserMenu()
    };

    const handleParentBtnClick = (url: any) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const toggleDrawer = (event: any) => {

        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setOpenParentSetting(!openParentSetting);

    };

    const toggleAccountSettings = (event: any) => {

        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setOpenAccountSetting(!openAcountSetting);

    };

    const avatarDiv = () => {
        let url = null
        if (typeof window !== 'undefined') {
            url = localStorage.getItem("profile_pic");
        }

        return (
            <Avatar className="profile-avatar" alt="Nikunj Solanki" src={url != null ? url : undefined} />
        )
    }

    return (
        <>
            <AppBar position="static">
                <Box sx={{ mx: 2 }}>
                    {/* <Container maxWidth="lg"> */}
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                            className='dashboard-topbar-logo'
                        >
                            <img src="/images/logo.png" alt="logo" />
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                                    display: { xs: 'block', md: 'none' },
                                    textAlign: "center"
                                }}
                            >
                                {pages.map((page) => (
                                    <div key={page.id}>
                                        <MenuItem
                                            key={page.id}
                                            className={(isActive === page.id) ? "menu-button-mobile active" : "menu-button-mobile"}
                                            onClick={() => Router.replace(page.link)}>
                                            <Typography textAlign="center">{page.label}</Typography>
                                        </MenuItem>
                                    </div>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                            className='dashboard-topbar-logo'
                        >
                            <img src="/images/logo.png" alt="logo" />
                        </Typography>
                        <Box justifyContent={"center"} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <div key={page.id}>
                                    {
                                        page && page.id == 4 ? (
                                            <Button
                                                key={page.id}
                                                className="parent-settings-button"
                                                onClick={() => handleParentBtnClick(page.link)}
                                                sx={{ m: 2 }}
                                            >
                                                <Icon color="inherit" fontSize='small' sx={{ mr: 1 }}>{page.icon}</Icon>
                                                {page.label}
                                            </Button>
                                        ) : (
                                            <Button
                                                key={page.id}
                                                className={(isActive === page.id) ? "menu-button active" : "menu-button"}
                                                onClick={() => handleMenuClick(page.id, page.link)}
                                                sx={{ my: 2, color: 'white', display: 'block' }}
                                            >
                                                <Icon color="inherit" >{page.icon}</Icon>
                                                {page.label}
                                            </Button>
                                        )
                                    }
                                </div>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>

                            <Tooltip title="Open settings">
                                <IconButton className="topbar-profile-icon" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Typography sx={{ display: { xs: "none", sm: "none", md: "inherit", lg: "inherit" } }} className="profile-name" color="secondary">
                                        {childDetails.child_name}
                                    </Typography>
                                    {
                                        avatarDiv()
                                    }
                                    {/* <Avatar className="profile-avatar" alt="Nikunj Solanki" src={childDetails.profile_image_url} /> */}
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting.id} onClick={() => handleMenuItemClick(setting.id)}>
                                        {setting.icon}
                                        <Typography variant='subtitle2' textAlign="center" sx={{ ml: 1 }}>{setting.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                    {/* </Container> */}
                </Box>

            </AppBar>
            {
                openAcountSetting &&
                <AccountSettingsModel
                    open={openAcountSetting}
                    onClose={(event: any) => toggleAccountSettings(event)} />
            }


        </>
    )

}