import { SetStateAction, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';

import { NavItem } from './nav-item';
import { menuItems } from './admin-menu';
import { NavSubItem } from './nav-sub-item';

interface Props {
  open: boolean,
  onClose: (value: SetStateAction<boolean>) => void
}

export const DashboardSidebar = (props: Props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          height: "100%",
          flexDirection: 'column',
          background: 'rgb(0,0,0)'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/admin/dashboard"
              passHref
            >
              <img src="/images/logo.png" alt="logo" className={"admin-logo"} />
            </NextLink>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            mb: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            item.hasOwnProperty("children") ? (
              <NavSubItem
                key={item.title}
                icon={item.icon}
                href={item.href}
                title={item.title}
                subitem={item.children}
              />
            ) : (
              <NavItem
                key={item.title}
                icon={item.icon}
                href={item.href}
                title={item.title}
              />
            )
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: '#111827',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: '#111827',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
