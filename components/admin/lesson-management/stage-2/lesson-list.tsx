import * as React from 'react';
import {
  Box, Button, Typography,
} from '@mui/material';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions } from "mui-datatables";
import { getVideosFromVdoCipher } from '../../../../store/thunk/admin/lesson';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { ApolloClientType, VideoData } from '../../../../store/Interface';
import EditVideoModel from '../../model/edit-video-model';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { GetVideoFromVdoData } from '../../../../store/slices/admin/lessonSlice';
import config from '../../../../config/config';

export const LessonList = () => {

  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
  const { videoList } = useAppSelector((state) => state.lessonReducer);

  const [openEditVideoModel, setOpenEditVideoModel] = React.useState(false);
  const [videoData, setVideoData] = React.useState<VideoData | null>(null);
  const [videoListData, setVideoListData] = React.useState<any>([]);
  const [pageNo, setPageNo] = React.useState<number>(1);
  const [tableOption, setTableOptions] = React.useState<MUIDataTableOptions>({
    filter: true,
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    count: 0,
    serverSide: true,
    // responsive: "stacked",
    responsive: "vertical",
    rowsPerPage: 20,
    rowsPerPageOptions: [],
    download: false,
    print: false,
    viewColumns: false,
    onTableChange: (action, tableState) =>  {
      if (action === "changePage") { 
        console.log("tableState", tableState);
        
        onChangePage(tableState.page + 1)
      }
    }
  });

  React.useEffect(() => {
    dispatch(GetVideoFromVdoData([]));
    let _request = {
      stage_no: "2",
      page_no: 1
    }
    dispatch(getVideosFromVdoCipher({_request,adminClient}));
  }, []);

  React.useEffect(() => {
    setVideoListData([]);
    let _request = {
      stage_no: "2",
      page_no: pageNo
    }
    dispatch(getVideosFromVdoCipher({_request,adminClient}));
  },[pageNo])

  React.useEffect(() => {    
    if (videoList && videoList?.count > 0) { 
      setVideoListData(videoList?.rows);
      setTableOptions({
        ...tableOption,
        count: videoList?.count
      })
    } else {
      setVideoListData([]);
      setTableOptions({
        ...tableOption,
        count: 0
      })
    }
  },[videoList])

  const toggleDrawer = (value: VideoData | null) => {
		// setLessonData(value ? value : null);
    
    setVideoData(value);
		setOpenEditVideoModel(!openEditVideoModel);
	}

  const onChangePage = (pageNo: number) => {
    if (pageNo && pageNo !== 0) {
      setPageNo(pageNo)
    }
  }

  const tableColumns: MUIDataTableColumn[] = [
    {
      name: "#",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value
        }
      }
    },
    {
      label: "Video title",
      name: "video title"
    },
    {
      label: "Video description",
      name: "video description",
      options: {
				filter: false,
				setCellProps: () => ({ style: { minWidth: "150px" } }),
				customBodyRender: (value) => {          
					return (
						<Box>
                <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </Box>
					)
				}
			}
    },
    {
      label: "Status",
      name: "status",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return value.toUpperCase()
        }
      }
    },
    {
      label: "upload time",
      name: "upload time",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return moment.unix(value).format("MMM Do YYYY, HH:mm:ss");
        }
      }
    },
    {
			name: "Action",
			options: {
				filter: false,
				setCellProps: () => ({ style: { minWidth: "150px" } }),
				customBodyRender: (value) => {
					return (
						<div>
							<Button type="button" className="min_width_auto" sx={{ backgroundColor: "#3f51b5" }} variant="contained" title="View Detail"
							onClick={() => toggleDrawer(value)}
              >
								<EditIcon fontSize='small' />
							</Button>
						</div>
					)
				}
			}
		}
    
  ];

  const renderVideos = () => {
    let data: any[] = [];
    videoListData && videoListData.map((val: VideoData, index: number) => {
      data.push(
        [
          Number(val.title.split(' ').pop()),
          val.title ? val.title : "-",
          val.description ? val.description : "-",
          val.status ? val.status : "-",
          val.upload_time ? val.upload_time : "-",
          val
        ]
      )
    })
    return data;
  }

  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          my: 1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h5"
        >
          Manage Lesson
        </Typography>
      </Box>
      <MUIDataTable
        title={"Lesson List"}
        data={renderVideos()}
        columns={tableColumns}
        options={tableOption}
      />
      {
        openEditVideoModel && videoData && (
          <EditVideoModel
            pageNo={pageNo}
            videoData={videoData}
            open={openEditVideoModel}
            onClose={toggleDrawer}
            stageNo={config.stage_2}
            />
        )
      }
    </Box>
  );
};
