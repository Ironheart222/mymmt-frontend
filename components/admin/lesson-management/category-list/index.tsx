import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { ApolloClientType } from "../../../../store/Interface";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getCategoryList } from "../../../../store/thunk/admin/lesson";
import CategoryLessonModel from "../../model/category-lesson-model";

export const CategoryLayout = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { categoryList } = useAppSelector((state) => state.lessonReducer);

  const [categoryData, setCategoryData] = React.useState<[]>([]);
  const [categoryLessonData, setCategoryLessonData] = React.useState<[]>([]);
  const [categoryName, setCategoryName] = React.useState<any>("");
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [openCategoryModel, setOpenLessonModel] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(getCategoryList({ adminClient }));
  }, []);

  React.useEffect(() => {
    if (categoryList && categoryList?.length > 0) {
      setCategoryData(categoryList);
    } else {
      setCategoryData([]);
    }
  }, [categoryList]);

  const toggleDrawer = (value: any) => {
    setCategoryName(value.category_name);
    setCategoryLessonData(
      value.lesson_detail?.length > 0 ? value.lesson_detail : []
    );
    setOpenLessonModel(!openCategoryModel);
  };

  const options: MUIDataTableOptions = {
    filter: true,
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    responsive: "vertical",
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [25, 50, 100, 150],
    download: false,
    print: false,
    viewColumns: false,
    onChangeRowsPerPage: (val: number) => {
      setRowsPerPage(val);
    },
  };

  const tableColumns: MUIDataTableColumn[] = [
    {
      name: "#",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    {
      label: "Category Name",
      name: "category_name",
      options: {
        customBodyRender: (value) => {
          return <span>{value}</span>;
        },
      },
    },
    {
      label: "Category Tag",
      name: "category_tag",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Active",
      name: "is_active",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return value.toString().toUpperCase();
        },
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        setCellProps: () => ({
          style: { minWidth: "150px", maxWidth: "150px" },
        }),
        customBodyRender: (value) => {
          return (
            <div>
              <Button
                type="button"
                className="min_width_auto"
                sx={{ backgroundColor: "#3f51b5" }}
                variant="contained"
                title="View Detail"
                onClick={() => toggleDrawer(value)}
              >
                <VisibilityIcon fontSize="small" />
              </Button>
            </div>
          );
        },
      },
    },
  ];

  const renderList = () => {
    let data: any[] = [];
    categoryData.map((val: any, index: number) => {
      data.push([
        index + 1,
        val.category_name ? val.category_name : "-",
        val.category_tag ? val.category_tag : "-",
        val.is_active ? val.is_active : "-",
        val,
      ]);
    });
    return data;
  };

  return (
    <Box {...props}>
      <Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ m: 1, color: "#243248" }} variant="h5">
            Category - <b>List</b>
          </Typography>
        </Box>

        <Box sx={{ my: 2 }}>
          <MUIDataTable
            title={""}
            data={renderList()}
            columns={tableColumns}
            options={options}
          />
        </Box>
      </Box>
      {openCategoryModel && (
        <CategoryLessonModel
          categoryName={categoryName}
          lessonData={categoryLessonData}
          open={openCategoryModel}
          onClose={toggleDrawer}
        />
      )}
    </Box>
  );
};
