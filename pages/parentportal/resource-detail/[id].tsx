import { Box } from "@mui/material";
import * as React from "react";
import ParentSettingsLayout from "../../../components/parent-setting/parent-settings-layout";
import PortalResourcesDetails from "../../../components/portal-resources/portal-resources-details";
import Auth from "../../../config/auth";
import { useRouter } from "next/router";

function PortalResourcesDetailLayout() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <ParentSettingsLayout>
      <Box sx={{ m: { xs: 1, sm: 2, md: 4, lg: 4 } }}>
        <PortalResourcesDetails folderId={id} />
      </Box>
    </ParentSettingsLayout>
  );
}

export default Auth(PortalResourcesDetailLayout);
