import { Add } from "@mui/icons-material"
import { Box, Button, Card, CardActionArea, Divider, Typography } from "@mui/material"
import FolderIcon from '@mui/icons-material/Folder';
import Link from "next/link";

export const Folder = ({ name, id, documents }: any) => {
    return (
        <Link href={`/admin/parent-resources/${id}`}>
            <Box
                sx={{
                    display: 'flex',
                    borderRadius: 2,
                    border: "1px solid #ebe9f9",
                    flexDirection: "row",
                    cursor: "pointer",
                    p:1,
                    margin: 1,
                }}>
                        
                <img src="/images/folder-icon.png" style={{ width: "40px", height: "40px"}} />
                <Box  
                    sx={{
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: "center",
                        flexGrow: 5,
                        px:2
                    }}>
                    <Typography variant='body1'>
                        {name}
                    </Typography>
                    <Typography variant='caption' sx={{ color: "#676d78" }}>{documents?.length || 0} FILES</Typography>
                </Box>
                <Box>

                </Box>
            </Box>
        </Link>
    )
}