import * as React from "react";
import {
  IconButton,
  Button,
  Box,
  Typography,
  InputAdornment,
  InputLabel,
  CircularProgress,
  Drawer,
  Grid,
  TextField,
  OutlinedInput,
  FormHelperText,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { ApolloClientType } from "../../../store/Interface";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Validations from "../../../helpers/validations";
import {
  addUpdateSubscriptionPlan,
  getSubscriptionPlanById,
} from "../../../store/thunk/admin/subscription";
import { GetSubscriptionPlanById } from "../../../store/slices/admin/subscription";

interface FormData {
  title: string;
  subtitle: string;
  noOfStudent: string;
  amount: string;
  descriptionArr: string[];
}
interface FormError {
  title?: string;
  subtitle?: string;
  no_of_student?: string;
  amount?: string;
  description?: string;
}

interface PropType {
  open: boolean;
  toggleModel: (value: any) => void;
  planId: string;
}

export default function AddPlanModel(props: PropType) {
  const { toggleModel, open, planId } = props;

  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { subscriptionPlanData } = useAppSelector(
    (state) => state.adminSubscriptionSlice
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);

  const [description, setDescription] = React.useState<string>("");
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    subtitle: "",
    noOfStudent: "",
    amount: "",
    descriptionArr: [],
  });

  const [formError, setFormError] = React.useState<FormError>({
    title: "",
    subtitle: "",
    no_of_student: "",
    amount: "",
    description: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  React.useEffect(() => {
    dispatch(GetSubscriptionPlanById(null));
    if (planId) {
      let _request = {
        plan_id: planId,
      };
      dispatch(getSubscriptionPlanById({ _request, client: adminClient }));
    } else {
      setFormData({
        ...formData,
        title: "",
        subtitle: "",
        noOfStudent: "",
        amount: "",
        descriptionArr: [],
      });
    }
  }, [planId]);

  React.useEffect(() => {
    if (subscriptionPlanData) {
      let arr = subscriptionPlanData?.description
        ? subscriptionPlanData?.description.split("|")
        : [];

      setFormData({
        ...formData,
        title: subscriptionPlanData?.name || "",
        subtitle: subscriptionPlanData?.metadata?.subtitle || "",
        noOfStudent: subscriptionPlanData?.metadata?.max_child_allowed || "",
        amount: subscriptionPlanData?.product_price?.unit_amount
          ? String(subscriptionPlanData?.product_price?.unit_amount / 100)
          : "",
        descriptionArr: arr,
      });
    }
  }, [subscriptionPlanData]);

  const handleChange =
    (prop: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event) {
        setFormData({ ...formData, [prop]: event.target.value });
        if (event.target.value) {
          setFormError({ ...formError, [prop]: "" });
        }
      }
    };

  const handleAddDescription = () => {
    if (description.trim()) {
      let arr: string[] = [...formData.descriptionArr];
      arr.push(description);
      setFormData({ ...formData, descriptionArr: arr });
      setDescription("");
      setFormError({ ...formError, description: "" });
    }
  };

  const handleDeleteDescription = (index: number) => {
    let arr: string[] = [...formData.descriptionArr];
    arr.splice(index, 1);
    setFormData({ ...formData, descriptionArr: arr });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let _request = {
      plan_id: planId ? planId : "",
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      no_of_student: formData.noOfStudent.trim(),
      amount: formData.amount.toString().trim(),
      description: formData.descriptionArr,
    };

    let allError = Validations.validateAddPlanForm(_request);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(
        addUpdateSubscriptionPlan({
          _request,
          adminClient,
          result: (res: any) => {
            setLoading(false);
            if (res.status == "true") {
              toggleModel(null);
            }
          },
        })
      );
    }
    setFormError(allError);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => toggleModel(null)}
      variant="temporary"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          scrollBehavior: "smooth",
          my: 2,
        }}
        component="form"
        className="form-element"
        onSubmit={handleSubmit}
        noValidate
      >
        <Box
          sx={{
            mx: 3,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item>
              <Typography variant="h6">
                {planId ? "Edit Plan" : "Add Plan"}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => toggleModel(null)}>
                <CloseIcon fontSize={"small"} />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mx: 4,
            minWidth: "400px",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1" sx={{ mx: 1 }}>
            {planId
              ? "Edit a perticular subscription plan."
              : "Create a subscription plan for all user."}
          </Typography>

          <Box
            sx={{
              mt: 3,
              mb: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box className="discount-title">
              <Typography variant="subtitle2">Plan Settings</Typography>
            </Box>

            <Grid container sx={{ px: 2 }}>
              {/* Plan Title */}
              <Grid item md={12} sm={12} xs={12}>
                <InputLabel className="textfield-label" required>
                  Plan Title
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  id="plan_title"
                  name="plan_title"
                  autoComplete="plan_title"
                  placeholder="Plan Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  autoFocus
                  error={formError && formError.title ? true : false}
                  helperText={formError && formError.title}
                />
                <Typography
                  variant="body1"
                  sx={{ mt: 2, color: "rgba(108,108,132,1)" }}
                >
                  The subscription plan title your customer will select and
                  purchase plan.
                </Typography>
              </Grid>

              {/* Plan Subtitle */}
              <Grid item md={12} sm={12} xs={12}>
                <InputLabel className="textfield-label" required>
                  Plan Subtitle
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  disabled
                  id="plan_subtitle"
                  name="plan_subtitle"
                  autoComplete="plan_subtitle"
                  placeholder="Plan Subtitle"
                  value={formData.subtitle}
                  onChange={handleChange("subtitle")}
                  autoFocus
                  error={formError && formError.subtitle ? true : false}
                  helperText={formError && formError.subtitle}
                />
                <Typography
                  variant="body1"
                  sx={{ mt: 2, color: "rgba(108,108,132,1)" }}
                >
                  The subscription plan subtitle describes how many children
                  added to this plan.
                </Typography>
              </Grid>

              {/* Max no of student */}
              {/* <Grid item md={12} sm={12} xs={12}>
                                <InputLabel className="textfield-label" required>Max no of Student</InputLabel>
                                <TextField
                                    required
                                    fullWidth
                                    id="no_of_student"
                                    name="no_of_student"
                                    autoComplete="no_of_student"
                                    placeholder="Max no of Student"
                                    value={formData.noOfStudent}
                                    onChange={handleChange('noOfStudent')}
                                    autoFocus
                                    error={formError && formError.no_of_student ? true : false}
                                    helperText={formError && formError.no_of_student}
                                />
                                <Typography variant='body1' sx={{ mt: 2, color: "rgba(108,108,132,1)" }}>
                                    No of student describes how many student allowed to this plan. For example, 3
                                </Typography>
                            </Grid> */}

              {/* Amount (per amount) */}
              <Grid item md={12} sm={12} xs={12}>
                <InputLabel className="textfield-label" required>
                  Amount (Per month)
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  id="amount"
                  name="amount"
                  autoComplete="amount"
                  placeholder="Amount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {<AttachMoneyIcon fontSize="small" />}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {<span>/Month</span>}
                      </InputAdornment>
                    ),
                  }}
                  value={formData.amount}
                  onChange={handleChange("amount")}
                  autoFocus
                  error={formError && formError.amount ? true : false}
                  helperText={formError && formError.amount}
                />
                <Typography
                  variant="body1"
                  sx={{ mt: 2, color: "rgba(108,108,132,1)" }}
                >
                  Enter the amount that the customer will pay to use our
                  service.
                </Typography>
              </Grid>

              {/* Plan description */}
              <Grid item md={12} sm={12} xs={12}>
                <InputLabel className="textfield-label" required>
                  Plan Description
                </InputLabel>
                <OutlinedInput
                  required
                  // disabled
                  fullWidth
                  id="description"
                  name="description"
                  autoComplete="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  sx={{ paddingRight: "0px" }}
                  endAdornment={
                    <InputAdornment position="end">
                      {
                        <Button
                          variant="text"
                          // disabled
                          onClick={handleAddDescription}
                        >
                          ADD
                        </Button>
                      }
                    </InputAdornment>
                  }
                  autoFocus
                  error={formError && formError.description ? true : false}
                />
                {formError && formError.description && (
                  <FormHelperText error id="password-error">
                    {formError.description}
                  </FormHelperText>
                )}
              </Grid>
              {formData.descriptionArr.length > 0 && (
                <Grid item md={12} sm={12} xs={12}>
                  <Box className="description-box">
                    {formData.descriptionArr.map((value: string, i: number) => (
                      <Chip
                        key={i}
                        sx={{ m: 0.2 }}
                        label={value}
                        size={"small"}
                        color={"success"}
                        onDelete={() => handleDeleteDescription(i)}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              <Typography
                variant="body1"
                sx={{ mt: 2, color: "rgba(108,108,132,1)" }}
              >
                Add a description to help the user decide which plan to use.
              </Typography>
            </Grid>
          </Box>
        </Box>

        <Box display={"flex"} justifyContent={"center"} sx={{ mx: 6, mb: 2 }}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading ? true : false}
          >
            Save
            {loading && <CircularProgress size={20} />}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
