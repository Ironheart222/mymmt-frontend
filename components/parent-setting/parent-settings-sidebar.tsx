import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { ProSidebar, SidebarContent, SidebarFooter } from "react-pro-sidebar";
import { ParentSettingsSidebarItem } from "./parent-settings-sidebaritem";
import {
  Person,
  ArrowForwardIos,
  Edit,
  Payment,
  CardMembership,
  Hub,
  Folder,
} from "@mui/icons-material";
import { ParentSideBarType } from "../../store/Interface";
import { useAppDispatch } from "../../store/store";
import { parentLogout } from "../../store/slices/userSlice";
import Router from "next/router";

const sidebarMenu: ParentSideBarType[] = [
  {
    icon: <Person />,
    name: "Parent Details",
    subname: "Student Profiles",
    href: "/parentportal",
  },
  {
    icon: <CardMembership />,
    name: "Subscription Plan",
    href: "/parentportal/subscription-plan",
  },
  {
    icon: <Hub />,
    name: "Become An Affiliate",
    href: "/parentportal/affiliate",
  },
  {
    icon: <Payment />,
    name: "Payment Method",
    href: "/parentportal/payment-method",
  },
  {
    icon: <Folder />,
    name: "Resources",
    href: "/parentportal/resources",
  },
];

export const ParentSettingsSidebar = () => {
  const dispatch = useAppDispatch();

  const [slideOpen, setSlideOpen] = React.useState(false);
  // const [selectedItem, setSelectedItem] = React.useState<string>("Student Profiles");

  const handleToggleSidebar = () => {
    setSlideOpen(!slideOpen);
  };

  const handleParentLogout = () => {
    Router.replace("/lesson-library");
    dispatch(parentLogout());
  };

  return (
    <Box className="lesson-library-container">
      <div
        className={slideOpen ? "sidebar-wrapper active" : "sidebar-wrapper"}
      ></div>
      <ProSidebar className={slideOpen ? "active" : ""}>
        <div className="sidebar-btn" onClick={handleToggleSidebar}>
          <ArrowForwardIos />
        </div>
        {/* <div> */}
        <SidebarContent className="menusidebar-wrapper">
          {sidebarMenu.map((val, key) => {
            return <ParentSettingsSidebarItem key={key} menu={val} />;
          })}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: "flex" }}
            className="dashboard-logo"
          >
            <img
              src="/images/logo.png"
              alt="logo"
              className="parent-sidebar-img"
            />
          </Typography>
        </SidebarContent>
      </ProSidebar>
    </Box>
  );
};
