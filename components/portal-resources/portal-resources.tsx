import { Box, Paper, Grid, Typography } from "@mui/material";
import * as React from "react";

import { ApolloClientType } from "../../store/Interface";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getResourcesFolder } from "../../store/thunk/admin/resourceThunk";
import { Folder } from "./folder";

function PortalResources() {
  const dispatch = useAppDispatch();

  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { folderDetails } = useAppSelector((state) => state.resourceSlice);

  React.useEffect(() => {
    dispatch(getResourcesFolder(userClient));
  }, []);

  React.useEffect(() => {}, []);

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body1" className="header-h6 border-green">
          Resource - <b>Folders</b>
        </Typography>
      </Box>
      <Box sx={{ my: 2 }}>
        {/* <Paper
          sx={{
            borderRadius: "10px",
            minHeight: "280px",
            p: 2,
            display: "flex",
            justifyContent: "center",
          }}
          elevation={0}
        > */}
        <Grid container spacing={2}>
          {folderDetails.map((folder, i) => (
            <Grid item md={3} key={i}>
              <Folder
                name={folder.folder_name}
                numOfFiles={folder.document_list.length}
                folderId={folder.folder_id}
              />
            </Grid>
          ))}
        </Grid>
        {/* </Paper> */}
      </Box>
    </Box>
  );
}

export default PortalResources;
