import * as React from 'react';
import {
    Box,
    Paper,
    Tab,
    Typography,
} from '@mui/material';
import { MappedLesson } from './mapped-lesson';
import { LessonList } from './lesson-list';
import { WorksheetList } from './worksheet-list';
import { TabContext, TabList, TabPanel } from '@mui/lab';

export const LessonManagementToolbar = (props: any) => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    mb:1
                }}
            >
                <Typography
                    sx={{ m: 1 }}
                    variant="h5"
                >
                    Lesson management : <b>STAGE-3</b>
                </Typography>
            </Box>
            <Paper {...props} elevation={6}>
                <Box sx={{ width: '100%', typography: 'body1'}}>
                    <TabContext value={value}>
                        <Box >
                            <TabList onChange={handleChange} variant="scrollable" allowScrollButtonsMobile scrollButtons="auto" aria-label="lab API tabs example">
                                <Tab label="Mapped Lessons & Worksheets" value="1" />
                                <Tab label="Lesson Video" value="2" />
                                <Tab label="Worksheets" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <MappedLesson/>
                        </TabPanel>
                        <TabPanel value="2">
                            <LessonList/>
                        </TabPanel>
                        <TabPanel value="3">
                            <WorksheetList/>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Paper>
        </Box>
    )
}


