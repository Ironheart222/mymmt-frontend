import { Box } from "@mui/material";
import * as React from "react";
import ParentSettingsLayout from "../../components/parent-setting/parent-settings-layout";
import PortalResources from "../../components/portal-resources/portal-resources";
import Auth from "../../config/auth";

function PortalResourcesLayout() {
  return (
    <ParentSettingsLayout>
      <Box sx={{ m: { xs: 1, sm: 2, md: 4, lg: 4 } }}>
        <PortalResources />
      </Box>
    </ParentSettingsLayout>
  );
}

export default Auth(PortalResourcesLayout);
