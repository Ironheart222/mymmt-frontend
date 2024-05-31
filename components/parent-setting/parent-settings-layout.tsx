import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import Topbar from "../header/topbar";
import { ParentSettingsSidebar } from "./parent-settings-sidebar";
import { mdTheme } from "../../config/theme_config";
import ParentSettingsModel from "../model/parent-settings-model";
import Auth from "../../config/auth";
import el from "date-fns/esm/locale/el/index.js";
import ParentTopbar from "../header/parent-topbar";
import WelcomeModel from "../model/welcome-model";

const ParentLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 75,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

const ParentSettingLayout = (props: any) => {
  const { children } = props;
  const [openParentSetting, setOpenParentSetting] = React.useState(true);
  const [openWelcomeModel, setOpenWelcomeModel] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    let parentToken = localStorage.getItem("parent-token");
    let welcomeTxt = localStorage.getItem("welcome_text");
    let planPurchasedStatus = localStorage.getItem("plan_purchased_status");

    if (welcomeTxt && welcomeTxt == "true" && planPurchasedStatus == "true") {
      setOpenWelcomeModel(true);
    }

    if (parentToken && parentToken !== "undefined") {
      setOpenParentSetting(false);
    } else {
      setOpenParentSetting(true);
    }
  }, []);

  const toggleWelcomeModel = () => {
    localStorage.setItem("welcome_text", "false");
    setOpenWelcomeModel(!openWelcomeModel);
  };

  const toggleDrawer = (reason: string) => {
    if (reason !== "backdropClick") {
      setOpenParentSetting(!openParentSetting);
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      {openParentSetting && (
        <ParentSettingsModel
          open={openParentSetting}
          onClose={(_: any, reason: string) => toggleDrawer(reason)}
          onOpen={toggleDrawer}
          toggleWelcomeModel={toggleWelcomeModel}
        />
      )}
      {openWelcomeModel && (
        <WelcomeModel open={openWelcomeModel} onClose={toggleWelcomeModel} />
      )}
      <ParentTopbar />
      <ParentSettingsSidebar />
      <ParentLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
            p: 1,
          }}
        >
          {children}
        </Box>
      </ParentLayoutRoot>
    </ThemeProvider>
  );
};

export default Auth(ParentSettingLayout);
