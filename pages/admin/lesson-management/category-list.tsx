import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '../../../components/admin/dashboard/dashboard-layout';
import { LessonManagementToolbar } from '../../../components/admin/lesson-management/core-concepts-s2/lesson-management-toolbar';
import AdminAuth from '../../../config/admin-auth';
import { CategoryLayout } from '../../../components/admin/lesson-management/category-list';

const CategoryList = () => {

  return (
    <DashboardLayout>
      <Head>
        <title>
          Category List | Admin
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}>
        <Container maxWidth={false}>
          <CategoryLayout />
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

export default AdminAuth(CategoryList);
