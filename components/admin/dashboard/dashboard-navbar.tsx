import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { AppBar, Avatar, Badge, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Bell as BellIcon } from '../../../icons/bell';
import { UserCircle as UserCircleIcon } from '../../../icons/user-circle';
import { topBarMenu } from '../admin-menu/item-list';
import EditProfile from '../model/edit-profile';
import Router from 'next/router';
import { getAdminDetail } from '../../../store/thunk/admin/adminAuthThunk';
import { ApolloClientType } from '../../../store/Interface';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { adminLogout } from '../../../store/slices/admin/adminAuthSlice';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  zIndex: theme.zIndex.drawer + 1,
}));

interface Props {
  onSidebarOpen: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const DashboardNavbar = (props: Props) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)

  const { onSidebarOpen, ...other } = props;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [openEditProfile, setOpenEditProfile] = React.useState(false);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuItemClick = (flag: string) => {
    if (flag == "Edit Profile") {
      dispatch(getAdminDetail(adminClient));
      setOpenEditProfile(true)
    } else if (flag == "Logout") {
      // adminLogout();
      dispatch(adminLogout());
      Router.replace("/admin");
    }
    handleCloseUserMenu();
  };

  const toggleEditProfile = (event: any) => {

    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpenEditProfile(!openEditProfile);

  };

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          justifyContent: "center",
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 50,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          {/* <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Box sx={{ flexGrow: 1 }} />
          {/* <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
              <UsersIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          {/* <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1, mr: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Open Settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  height: 40,
                  width: 40,
                }}
                src="/images/usericon.png"
              >
                <UserCircleIcon fontSize="small" />
              </Avatar>
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
            {topBarMenu.map((item) => (
              <MenuItem key={item.id} onClick={() => handleMenuItemClick(item.label)}>
                {item.icon}
                <Typography textAlign="center" variant='subtitle2' sx={{ ml: 1 }}>{item.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </DashboardNavbarRoot>

      {
        openEditProfile &&
        <EditProfile
          open={openEditProfile}
          onClose={(event: any) => toggleEditProfile(event)} />
      }
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
