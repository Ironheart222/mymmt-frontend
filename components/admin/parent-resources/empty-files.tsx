import { Add } from "@mui/icons-material"
import { Box, Button, Card, CardActionArea, Divider, Typography } from "@mui/material"
import FolderIcon from '@mui/icons-material/Folder';
import Link from "next/link";

export const EmptyFiles = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                borderRadius: 3,
                flexDirection:"column",
                borderStyle: 'dashed',
                borderColor: 'grey',
                borderWidth: 1,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                // border: "1px solid grey",
                p: {xs:3, sm: 3, md: 4}
            }}>
            <Typography variant='h6'>
                Not Uploaded yet
            </Typography>
            <Typography variant='body1'>
                Upload documents you want to share with parents
            </Typography>
        </Box>
    )
}