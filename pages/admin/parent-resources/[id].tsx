import { Box, Container } from "@mui/material"
import Head from "next/head"
import { DashboardLayout } from "../../../components/admin/dashboard/dashboard-layout"
import { FileResources } from "../../../components/admin/parent-resources/file-resources"
import { useRouter } from 'next/router'

function FileLayout(){
  const router = useRouter();
  const { id } = router.query;
    return (
        <DashboardLayout>
          <Head>
            <title>
              Lesson Management | Admin
            </title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 4
            }}>
            <Container maxWidth={false}>
                <FileResources folderId={id} />
            </Container>
          </Box>
        </DashboardLayout>
      )

}

export default FileLayout