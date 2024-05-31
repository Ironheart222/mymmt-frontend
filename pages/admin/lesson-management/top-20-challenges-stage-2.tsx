import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '../../../components/admin/dashboard/dashboard-layout';
import { LessonManagementToolbar } from '../../../components/admin/lesson-management/stage-2/lesson-management-toolbar';
import AdminAuth from '../../../config/admin-auth';
import { Stage2Challenges } from '../../../components/admin/lesson-management/top-20-challenges/stage-2-challenges';


const Top20ChallengesStage2 = () => {

  return (
    <DashboardLayout>
      <Head>
        <title>
          Top 20 Challenges | Admin
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Container maxWidth={false}>
          <Stage2Challenges />
        </Container>
      </Box>
    </DashboardLayout>
  )
}

export default AdminAuth(Top20ChallengesStage2);
