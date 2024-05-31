import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '../../../components/admin/dashboard/dashboard-layout';
import { LessonManagementToolbar } from '../../../components/admin/lesson-management/core-concepts-s3/lesson-management-toolbar';
import AdminAuth from '../../../config/admin-auth';

const CoreConcepts = () => {

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
        }}
      >
        <Container maxWidth={false}>
          <LessonManagementToolbar />
        </Container>
      </Box>
    </DashboardLayout>
  )
}


// LessonManagement.getLayout = (page: React.ReactElement) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default AdminAuth(CoreConcepts);
