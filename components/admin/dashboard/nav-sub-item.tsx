import * as React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Collapse, ListItem } from '@mui/material';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { AnyIfEmpty } from 'react-redux';

interface Props {
    key: string;
    href: any;
    icon: any;
    title: any;
    subitem: any;
}

export const NavSubItem = (props: Props) => {
    const { href, icon, title, subitem, ...others } = props;
    const router = useRouter();
    const active = href ? router.pathname.includes(href) : false;

    const [open, setOpen] = React.useState<boolean>(active);

    React.useEffect(()=>{
              
        if(router.pathname.includes(href)){
            setOpen(active);
        }
    },[active]);

    const handleClick = () => {
      setOpen((prev: boolean) => !prev);
    };

    return (
        <Box className={open ? 'submenu-open-box' : ""}>
            <ListItem
                disableGutters
                sx={{
                    display: 'flex',
                    mb: 0.5,
                    py: 0,
                    px: !open ? 1 : 0 
                }}
                {...others}
            >
                
                <Button
                    component="a"
                    startIcon={icon}
                    endIcon={open ? (<ExpandLessRoundedIcon />) : (<ExpandMoreRoundedIcon />)}
                    disableRipple
                    onClick={handleClick}
                    className={"sidebar-item"}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        {title}
                    </Box>
                </Button>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItem disableGutters
                    sx={{
                        display: 'flex',
                        flexDirection: "column",
                        mb: 0.5,
                        py: 0,
                        px: 1,
                    }}
                    {...others}>
                    {subitem.map((child: any, key: any) => (
                        <NextLink
                            href={child.href}
                            passHref
                            key={key}
                        >
                            <Button
                                component="a"
                                startIcon={child.icon}
                                disableRipple
                                className={child.href == router.pathname ? "active-sidebar-item" : "sidebar-item"}
                            >
                                <Box sx={{ flexGrow: 1, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {child.title}
                                </Box>
                            </Button>
                        </NextLink>
                    ))}
                </ListItem>
            </Collapse>
        </Box>
    );
};

NavSubItem.propTypes = {
    href: PropTypes.string,
    icon: PropTypes.node,
    title: PropTypes.string,
    subitem: PropTypes.array
};
