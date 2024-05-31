import { Add } from "@mui/icons-material";
import { Box, Typography, Tooltip } from "@mui/material";

import Link from "next/link";

export const Folder = ({ name, numOfFiles, folderId }: any) => {
  return (
    <Link href={`/parentportal/resource-detail/${folderId}`}>
      <Box
        sx={{
          display: "flex",
          borderRadius: 2,
          border: "1px solid #ebe9f9",
          flexDirection: "row",
          cursor: "pointer",
          p: 1,
        }}
      >
        <img
          src="/images/folder-icon-green.png"
          style={{ width: "40px", height: "40px" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 5,
            px: 2,
          }}
        >
          <Tooltip title={name}>
            <Typography className="folder-title-text" variant="body1">
              {name}
            </Typography>
          </Tooltip>
          <Typography variant="caption" sx={{ color: "#676d78" }}>
            {numOfFiles} FILES
          </Typography>
        </Box>
        <Box></Box>
      </Box>
    </Link>
  );
};
