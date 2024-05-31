import * as React from 'react';
import {
	Box, Button, Typography,
} from '@mui/material';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions } from "mui-datatables";
import MappingDataModel from '../../model/map-data-model';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { deleteMapLesson, getMappedLesson } from '../../../../store/thunk/admin/lesson';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DialogDetails, LessonData } from '../../../../store/Interface';
import ConfirmationModel from '../../model/confirmation-model';
import { setLoading } from '../../../../store/slices/loadingSlice';
import moment from 'moment';
import { GetMappedLessonData } from '../../../../store/slices/admin/lessonSlice';

export const MappedLesson = () => {

	const dispatch = useAppDispatch();
	const { adminClient }: any = useAppSelector((state) => state.apolloClientReducer);
	const { mappedLessonData } = useAppSelector((state) => state.lessonReducer);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [openLessonMapModel, setOpenLessonMapModel] = React.useState(false);
	const [openEditMapModel, setOpenEditMapModel] = React.useState(false);
	const [lessonData, setLessonData] = React.useState<LessonData | null>(null);
	const [lessonNo,setLessonNo] = React.useState<string>("1");
	const [rowsPerPage,setRowsPerPage] = React.useState<number>(25);
	const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
		title: "",
		body_content: "",
		id: ""
	});
	const [openConfirmationModel, setOpenConfirmationModel] = React.useState<boolean>(false);

	React.useEffect(() => {
		dispatch(GetMappedLessonData([]));
		dispatch(getMappedLesson({_request:3,adminClient}));
	}, []);

	React.useEffect(() => {
		
		if (mappedLessonData && mappedLessonData.length > 0) {
			let number = mappedLessonData[mappedLessonData.length - 1].lesson_no + 1 
			setLessonNo(String(number));
		} else {
			setLessonNo("1");
		}
	},[mappedLessonData]);

	const toggleDrawer = (value: LessonData | null) => {
		setLessonData(value ? value : null);
		setOpenLessonMapModel(!openLessonMapModel);
	}

	const handleDeleteLesson = (id: string) => {
		if (id) {
			setLoading(true);
			let _request = {
				id: id,
				stage_no: 3
			}
			dispatch(deleteMapLesson({ _request, adminClient, result: (res: any) =>{
				setLoading(false);
				onClose();
			}}));
		}
	}

	const toggleConfirmationModel = (value: LessonData) => {
		if (value && value.lesson_id) {

			let dialogDetails: DialogDetails = {
				title: 'Delete Confirmation',
				body_content: "Are you sure you want to delete this Lesson?",
				id: String(value.lesson_id)
			}
			setDialogDetails(dialogDetails);
			setOpenConfirmationModel(!openConfirmationModel)

		} else {
			onClose();
		}
	}

	const onClose = () => {
		setDialogDetails({
			title: "",
			body_content: "",
			id: ""
		});
		setOpenConfirmationModel(!openConfirmationModel)
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
			label: "Lesson No",
			name: "lesson_no",
			options: {
				setCellProps: () => ({ style: { minWidth: "120px" }}),
				customBodyRender: (value) => {
					return `Lesson ${value}`
				}
			}
		},
		{
			label: "Lesson Name",
			name: "lesson name",
			options: {
				setCellProps: () => ({ style: { minWidth: "200px" } }),
				customBodyRender: (value) => {
					return value.title ? value.title : "-"
				}
			}
		},
		{
			label: "Worksheet Name",
			name: "worksheet name",
			options: {
				setCellProps: () => ({ style: { minWidth: "180px" } }),
				customBodyRender: (value) => {
					return value.worksheet_name ? value.worksheet_name : "-"
				}
			}
		},
		{
			label: "Stage No",
			name: "stage no",
			options: {
				setCellProps: () => ({ style: { minWidth: "120px" } }),
				customBodyRender: (value) => {
					return value ? value : "-"
				}
			}
		},
		{
			label: "Created Date",
			name: "created_Date",
			options: {
				setCellProps: () => ({ style: { minWidth: "200px" } }),
				customBodyRender: (value) => {
				  return moment(value).format("MMM Do YYYY, HH:mm:ss");
				}
			}
		},
		{
			label: "Updated Date",
			name: "updated_Date",
			options: {
				setCellProps: () => ({ style: { minWidth: "200px" } }),
				customBodyRender: (value) => {
				  return moment(value).format("MMM Do YYYY, HH:mm:ss");
				}
			}
		},
		{
			name: "Action",
			options: {
				filter: false,
				setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
				customBodyRender: (value) => {
					return (
						<div>
							<Button type="button" className="min_width_auto" sx={{ backgroundColor: "#3f51b5" }} variant="contained" title="View Detail"
								onClick={() => toggleDrawer(value)}
							>
								<EditIcon fontSize='small' />
							</Button>
							{" "}
							<Button type="button" className="min_width_auto" color="error" variant="contained" title="View Detail" onClick={() => toggleConfirmationModel(value)}>
								<DeleteRoundedIcon fontSize='small' />
							</Button>
						</div>
					)
				}
			}
		}
	];

	const options: MUIDataTableOptions = {
		filter: true,
		selectableRows: "none",
		selectableRowsOnClick: false,
		filterType: "dropdown",
		// responsive: "stacked",
		responsive: "vertical",
		rowsPerPage: rowsPerPage,
		rowsPerPageOptions: [25, 50, 100, 150],
		download: false,
		print: false,
		viewColumns: false,
		onChangeRowsPerPage: (val: number) => {
			setRowsPerPage(val);
		}
	};

	const renderLessonData = () => {
		let data: any[] = [];
		mappedLessonData && mappedLessonData.map((val: any, index: number) => {
			data.push(
				[
					index + 1,
					val.lesson_no ? val.lesson_no : "-",
					val.vdo_cipher_video ? val.vdo_cipher_video : "-",
					val.worksheet_detail ? val.worksheet_detail : "-",
					val.stage_no ? val.stage_no : "-",
					val.created_date ? val.created_date : "-",
					val.updated_date ? val.updated_date : "-",
					val,
				]
			)
		});
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
					Map Lesson And Worksheets
				</Typography>

				<Button
					color="primary"
					variant="contained"
					sx={{ m: 1 }}
					onClick={() => toggleDrawer(null)}
				>
					Mapped
				</Button>

			</Box>
			<MUIDataTable
				title={"Mapped Lesson List"}
				data={renderLessonData()}
				columns={tableColumns}
				options={options}
			/>

			{
				openLessonMapModel && (
					<MappingDataModel
						open={openLessonMapModel}
						lessonData={lessonData}
						onClose={toggleDrawer}
						stage_no={3}
						lesson_no={lessonNo}
					/>
				)
			}

			{
				openConfirmationModel && (
					<ConfirmationModel
						loading={loading}
						dialogDetails={dialogDetails}
						modelOpen={openConfirmationModel}
						onClose={onClose}
						onDelete={handleDeleteLesson} />
				)
			}
		</Box>
	);
};

