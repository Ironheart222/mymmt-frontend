import { AmountType } from "../components/admin/discount-code/add-discount-code";
import MESSAGES from "./messages";

const reWhiteSpace = /^[^-\s][\w\s-]+$/;
const passwordValidation =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const alphabet = /^[a-zA-Z]*$/;
const number = /^[0-9]+$/;
const phoneNumber = /^\+(?:[0-9] ?){6,14}[0-9]$/;
const personNameValidation = /^[a-zA-Z ]*$/;
const reWhiteSp = /^[^\s]+(\s+[^\s]+)*$/;
const emailValidation = /[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/;
// const emailValidation = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const alphabetWithSpace = /[^\w -]/;
const smallLetter = /^(?=.*[a-z])/;
const capitalLetter = /^(?=.*[A-Z])/;

const Validations = {
  validateLoginForm: (form: any) => {
    const errors: Partial<any> = {};
    const { email, password } = form;

    if (!email) {
      errors.email = MESSAGES.LOGIN.ERROR.EMAIL.EMPTY;
    } else if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.LOGIN.ERROR.EMAIL.EMAIL_VALIDATION;
    }

    if (!password) {
      errors.password = MESSAGES.LOGIN.ERROR.PASSWORD.EMPTY;
    }
    if (!reWhiteSp.test(String(password).toLowerCase())) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.WHITE_SPACE;
    }
    if (
      password.length < 8 ||
      !smallLetter.test(password) ||
      !capitalLetter.test(password) ||
      password.search(/[0-9]/) < 0 ||
      password.search(/[!#_$@%&]/) < 0
    ) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }
    return errors;
  },
  validateRegisterForm: (form: any) => {
    const errors: Partial<any> = {};
    const {
      first_name,
      last_name,
      email,
      confirm_email,
      mobile_no,
      // street_1,
      // suburb,
      country,
      state,
      // postal_code,
      login_password,
      setting_password,
      country_code,
      term_condition,
    } = form;

    if (!first_name) {
      errors.first_name = MESSAGES.REGISTER.ERROR.FIRST_NAME.EMPTY;
    }
    if (!last_name) {
      errors.last_name = MESSAGES.REGISTER.ERROR.LAST_NAME.EMPTY;
    }

    if (!email) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMPTY;
    }
    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMAIL_VALIDATION;
    }

    if (!confirm_email) {
      errors.confirm_email = MESSAGES.REGISTER.ERROR.CONFIRM_EMAIL.EMPTY;
    }

    if (confirm_email && confirm_email !== email) {
      errors.confirm_email = MESSAGES.REGISTER.ERROR.CONFIRM_EMAIL.INVALID;
    }

    if (!mobile_no) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.EMPTY;
    }
    if (mobile_no && !number.test(mobile_no)) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.NUMBER;
    }

    if (mobile_no && mobile_no.length < 10) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.DIGIT;
    }

    // if (!street_1) {
    //   errors.street_1 = MESSAGES.REGISTER.ERROR.STREET_1.EMPTY;
    // }

    // if (!postal_code) {
    //   errors.postal_code = MESSAGES.REGISTER.ERROR.POSTAL_CODE.EMPTY;
    // }
    // if (postal_code && postal_code.length > 6) {
    //   errors.postal_code = MESSAGES.REGISTER.ERROR.POSTAL_CODE.LENGTH_INVALID;
    // }

    // if (postal_code && alphabet.test(String(postal_code).toLowerCase())) {
    //   errors.postal_code = MESSAGES.REGISTER.ERROR.POSTAL_CODE.INVALID;
    // }

    // if (!suburb) {
    //   errors.suburb = MESSAGES.REGISTER.ERROR.SUBURB.EMPTY;
    // }

    if (!country) {
      errors.country = MESSAGES.REGISTER.ERROR.COUNTRY.EMPTY;
    }

    if (!state) {
      errors.state = MESSAGES.REGISTER.ERROR.STATE.EMPTY;
    }

    if (!reWhiteSp.test(String(login_password).toLowerCase())) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.WHITE_SPACE;
    }

    if (login_password.length < 8) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (
      !smallLetter.test(login_password) ||
      !capitalLetter.test(login_password) ||
      login_password.search(/[0-9]/) < 0 ||
      login_password.search(/[!#_$@%&]/) < 0
    ) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }

    if (!login_password) {
      errors.login_password = MESSAGES.REGISTER.ERROR.PASSWORD.EMPTY;
    }

    if (!reWhiteSp.test(String(setting_password).toLowerCase())) {
      errors.setting_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.WHITE_SPACE;
    }

    if (setting_password.length < 8) {
      errors.setting_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (
      !smallLetter.test(setting_password) ||
      !capitalLetter.test(setting_password) ||
      setting_password.search(/[0-9]/) < 0 ||
      setting_password.search(/[!#_$@%&]/) < 0
    ) {
      errors.setting_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }

    if (!setting_password) {
      errors.setting_password = MESSAGES.REGISTER.ERROR.PASSWORD.EMPTY;
    }

    if (!country_code) {
      errors.country_code = MESSAGES.REGISTER.ERROR.COUNTRY_CODE.EMPTY;
    }

    if (!term_condition) {
      errors.term_condition = MESSAGES.REGISTER.ERROR.TERM_CONDITION.EMPTY;
    }

    // if (!industry) {
    //   errors.industry = Messages.SIGNUP.ERROR.SELECT_INDUSTRY.EMPTY;
    // }
    // if (!img) {
    //   errors.img = Messages.SIGNUP.ERROR.IMAGE.EMPTY;
    // }
    return errors;
  },
  validateAddChildForm: (form: any) => {
    const errors: Partial<any> = {};
    const { child_name, birth_date, class_no, stage_no, video_allowed_count } =
      form;

    if (!child_name) {
      errors.child_name = MESSAGES.CHILD.ERROR.NAME.EMPTY;
    }

    if (!birth_date) {
      errors.birth_date = MESSAGES.CHILD.ERROR.DOB.EMPTY;
    }

    if (!class_no) {
      errors.class_no = MESSAGES.CHILD.ERROR.CLASS.EMPTY;
    }

    if (!stage_no) {
      errors.stage_no = MESSAGES.CHILD.ERROR.STAGE.EMPTY;
    }

    if (!video_allowed_count) {
      errors.video_allowed_count = MESSAGES.CHILD.ERROR.VIDEO_COUNT.EMPTY;
    }
    return errors;
  },
  validateParentAuthForm: (form: any) => {
    const errors: Partial<any> = {};
    const { password } = form;

    if (password && password.length < 8) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    /* if (!smallLetter.test(password) || !capitalLetter.test(password) || password.search(/[0-9]/) < 0 || password.search(/[!#_$@%&]/) < 0) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    } */

    if (!password) {
      errors.password = MESSAGES.LOGIN.ERROR.PASSWORD.EMPTY;
    }
    return errors;
  },
  validateUpdateChildForm: (form: any) => {
    const errors: Partial<any> = {};
    const { child_name, birth_date, gender, school_name } = form;

    if (!child_name) {
      errors.child_name = MESSAGES.CHILD.ERROR.NAME.EMPTY;
    }

    if (!birth_date) {
      errors.birth_date = MESSAGES.CHILD.ERROR.DOB.EMPTY;
    }

    if (!gender) {
      errors.gender = MESSAGES.CHILD.ERROR.GENDER.EMPTY;
    }

    if (!school_name) {
      errors.school_name = MESSAGES.CHILD.ERROR.SCHOOL_NAME.EMPTY;
    }
    return errors;
  },
  validateForgotPasswordForm: (form: any) => {
    const errors: Partial<any> = {};
    const { email } = form;

    if (!email) {
      errors.email = MESSAGES.LOGIN.ERROR.EMAIL.EMPTY;
    }

    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.LOGIN.ERROR.EMAIL.EMAIL_VALIDATION;
    }
    return errors;
  },
  validateResetPasswordForm: (form: any) => {
    const errors: Partial<any> = {};
    const { password, cPassword } = form;

    if (!password) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.EMPTY;
    }
    if (password && password.length < 8) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (
      password &&
      (!smallLetter.test(password) ||
        !capitalLetter.test(password) ||
        password.search(/[0-9]/) < 0 ||
        password.search(/[!#_$@%&]/) < 0)
    ) {
      errors.password = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }

    if (!cPassword) {
      errors.cPassword = MESSAGES.VALID_PASSWORD.ERROR.CPASSWORD.EMPTY;
    }
    if (!reWhiteSp.test(String(cPassword).toLowerCase())) {
      errors.cPassword = MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.WHITE_SPACE;
    }

    if (cPassword !== password) {
      errors.cPassword =
        MESSAGES.VALID_PASSWORD.ERROR.CPASSWORD.CONFIRM_PASS_VALIDATION;
    }
    return errors;
  },
  validateAdminEditForm: (form: any) => {
    const errors: Partial<any> = {};
    const { name, email, old_password, new_password } = form;

    if (!name) {
      errors.name = MESSAGES.ADMIN_EDIT.ERROR.NAME.EMPTY;
    }

    if (!email) {
      errors.email = MESSAGES.ADMIN_EDIT.ERROR.EMAIL.EMPTY;
    }
    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.ADMIN_EDIT.ERROR.EMAIL.EMAIL_VALIDATION;
    }

    if (new_password && !old_password) {
      errors.old_password = MESSAGES.ADMIN_EDIT.ERROR.OLD_PASSWORD.EMPTY;
    }

    if (
      old_password &&
      (new_password.length < 8 ||
        !smallLetter.test(new_password) ||
        !capitalLetter.test(new_password) ||
        new_password.search(/[0-9]/) < 0 ||
        new_password.search(/[!#_$@%&]/) < 0)
    ) {
      errors.new_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }
    return errors;
  },
  validateAddVacationForm: (form: any) => {
    const errors: Partial<any> = {};
    const { title, country, start_date, end_date } = form;

    if (!title) {
      errors.title = MESSAGES.VACATION.ERROR.TITLE.EMPTY;
    }

    if (!country) {
      errors.country = MESSAGES.VACATION.ERROR.COUNTRY.EMPTY;
    }

    if (!start_date || !end_date) {
      errors.date_range = MESSAGES.VACATION.ERROR.DATE_PICKER.EMPTY;
    }

    return errors;
  },
  validateWorksheetForm: (form: any) => {
    const errors: Partial<any> = {};
    const { title, worksheet_id, description, file, fileURL } = form;

    if (!title) {
      errors.title = MESSAGES.WORKSHEET_MODEL.ERROR.TITLE.EMPTY;
    }

    if (!worksheet_id && !file) {
      errors.file = MESSAGES.WORKSHEET_MODEL.ERROR.FILE.EMPTY;
    }

    return errors;
  },
  validateUploadDocumentsForm: (form: any) => {
    const errors: Partial<any> = {};
    const { file, parent_id, folder_id, is_video, video_data } = form;

    if (!is_video && !file) {
      errors.file = MESSAGES.RESOURCEDOC_MODEL.ERROR.FILE.EMPTY;
    }

    if (!folder_id) {
      errors.folder_id = MESSAGES.RESOURCEDOC_MODEL.ERROR.FOLDER_ID.EMPTY;
    }

    // if (!parent_id.length) {
    //   errors.parent_id = MESSAGES.RESOURCEDOC_MODEL.ERROR.PARENT_ID.EMPTY;
    // }

    if (is_video && Object.keys(video_data).length <= 0) {
      errors.video_id = MESSAGES.RESOURCEDOC_MODEL.ERROR.VIDEO_ID.EMPTY;
    }

    return errors;
  },
  validateMappingForm: (form: any) => {
    const errors: Partial<any> = {};
    const { lesson_no, video_data, worksheet_id, category_id, stage_no } = form;

    if (!lesson_no) {
      errors.lesson_no = MESSAGES.MAPPING_LESSON.ERROR.LESSON_NO.EMPTY;
    }

    if (!video_data) {
      errors.lesson = MESSAGES.MAPPING_LESSON.ERROR.LESSON.EMPTY;
    }
    if (video_data && Object.keys(video_data).length === 0) {
      errors.lesson = MESSAGES.MAPPING_LESSON.ERROR.LESSON.EMPTY;
    }

    if (!worksheet_id) {
      errors.worksheet = MESSAGES.MAPPING_LESSON.ERROR.WORKSHEET.EMPTY;
    }

    if (!category_id && (stage_no == 20 || stage_no == 30)) {
      errors.category = MESSAGES.MAPPING_LESSON.ERROR.CATEGORY.EMPTY;
    }

    return errors;
  },
  validateEditVideoForm: (form: any) => {
    const errors: Partial<any> = {};
    const { title } = form;

    if (!title) {
      errors.title = MESSAGES.VIDEO_FORM.ERROR.TITLE.EMPTY;
    }

    return errors;
  },
  validateEditProfileForm: (form: any) => {
    const errors: Partial<any> = {};
    const {
      first_name,
      last_name,
      email,
      mobile_no,
      // street_1,
      // suburb,
      country,
      state,
      country_code,
      // postal_code
    } = form;

    if (!first_name) {
      errors.first_name = MESSAGES.REGISTER.ERROR.FIRST_NAME.EMPTY;
    }
    if (!last_name) {
      errors.last_name = MESSAGES.REGISTER.ERROR.LAST_NAME.EMPTY;
    }

    // if (!suburb) {
    //   errors.suburb = MESSAGES.REGISTER.ERROR.SUBURB.EMPTY;
    // }

    if (!email) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMPTY;
    }
    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMAIL_VALIDATION;
    }

    if (!mobile_no) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.EMPTY;
    }
    if (mobile_no && !number.test(mobile_no)) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.NUMBER;
    }

    if (mobile_no && mobile_no.length < 10) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.DIGIT;
    }

    // if (!street_1) {
    //   errors.street_1 = MESSAGES.REGISTER.ERROR.STREET_1.EMPTY;
    // }

    if (!country) {
      errors.country = MESSAGES.REGISTER.ERROR.COUNTRY.EMPTY;
    }

    if (!state) {
      errors.state = MESSAGES.REGISTER.ERROR.STATE.EMPTY;
    }

    if (!country_code) {
      errors.country_code = MESSAGES.REGISTER.ERROR.COUNTRY_CODE.EMPTY;
    }

    // if (!postal_code) {
    //   errors.postal_code = MESSAGES.REGISTER.ERROR.POSTAL_CODE.EMPTY;
    // }
    // if (postal_code && postal_code.length > 6) {
    //   errors.postal_code = MESSAGES.REGISTER.ERROR.POSTAL_CODE.LENGTH_INVALID;
    // }

    // if (postal_code && alphabet.test(String(postal_code).toLowerCase())) {
    //   errors.postal_code = MESSAGES.REGISTER.ERROR.POSTAL_CODE.INVALID;
    // }

    return errors;
  },
  validateDiscountForm: (form: any) => {
    const errors: Partial<any> = {};
    const {
      code,
      amount,
      percent,
      amount_type,
      currency,
      is_expiry,
      expiry_date,
      is_duration_in_months,
      duration,
      duration_in_months,
      is_plan,
      plan_id,
    } = form;

    if (!code) {
      errors.code = MESSAGES.DISCOUNT_CODE.ERROR.CODE.EMPTY;
    }

    if (!amount && amount_type == AmountType.FIXED_AMOUNT) {
      errors.amount = MESSAGES.DISCOUNT_CODE.ERROR.AMOUNT.EMPTY;
    }

    if (!percent && amount_type == AmountType.PERCENTAGE) {
      errors.amount = MESSAGES.DISCOUNT_CODE.ERROR.AMOUNT.EMPTY;
    }

    if (amount_type == AmountType.FIXED_AMOUNT && !currency) {
      errors.currency = MESSAGES.DISCOUNT_CODE.ERROR.CURRENCY.EMPTY;
    }

    if (is_expiry && !expiry_date) {
      errors.expiry_date = MESSAGES.DISCOUNT_CODE.ERROR.EXPIRY_DATE.EMPTY;
    }

    if (!is_expiry) {
      delete errors.expiry_date;
    }

    if (is_duration_in_months && duration != "forever" && !duration_in_months) {
      errors.duration_in_months =
        MESSAGES.DISCOUNT_CODE.ERROR.DURATION_IN_MONTH.EMPTY;
    }

    if (!is_duration_in_months) {
      delete errors.redemptions;
    }

    if (is_plan && !plan_id) {
      errors.subscription_plan =
        MESSAGES.DISCOUNT_CODE.ERROR.SUBSCRIPTION_PLAN.EMPTY;
    }

    if (!is_plan) {
      delete errors.subscription_plan;
    }

    return errors;
  },
  validateAddPlanForm: (form: any) => {
    const errors: Partial<any> = {};
    const { title, subtitle, no_of_student, amount, description } = form;

    if (!title) {
      errors.title = MESSAGES.ADD_PLAN.ERROR.TITLE.EMPTY;
    }

    if (!subtitle) {
      errors.subtitle = MESSAGES.ADD_PLAN.ERROR.SUBTITLE.EMPTY;
    }

    if (!no_of_student) {
      errors.no_of_student = MESSAGES.ADD_PLAN.ERROR.NO_OF_STUDENT.EMPTY;
    }

    if (no_of_student && !number.test(no_of_student)) {
      errors.no_of_student = MESSAGES.ADD_PLAN.ERROR.NO_OF_STUDENT.ONLYT_NUMBER;
    }

    // if (isNaN(amount) || amount === 0) {
    //   errors.amount = MESSAGES.ADD_PLAN.ERROR.AMOUNT.INVALID_AMOUNT;
    // }

    if (!amount) {
      errors.amount = MESSAGES.ADD_PLAN.ERROR.AMOUNT.EMPTY;
    }

    if (description.length <= 0) {
      errors.description = MESSAGES.ADD_PLAN.ERROR.DESCRIPTION.EMPTY;
    }

    return errors;
  },
  validateEmail: (form: any) => {
    const errors: Partial<any> = {};
    const { email } = form;

    if (!email) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMPTY;
    }
    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMAIL_VALIDATION;
    }
    return errors;
  },
  validateModalEmail: (form: any) => {
    const errors: Partial<any> = {};
    const { email, confirm_email, parent_id } = form;

    if (!email) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMPTY;
    }
    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMAIL_VALIDATION;
    }

    if (!confirm_email) {
      errors.confirm_email = MESSAGES.REGISTER.ERROR.CONFIRM_EMAIL.EMPTY;
    }

    if (confirm_email && confirm_email !== email) {
      errors.confirm_email = MESSAGES.REGISTER.ERROR.CONFIRM_EMAIL.INVALID;
    }

    if (!parent_id) {
      errors.parent_id = MESSAGES.REGISTER.ERROR.PARENT_ID.EMPTY;
    }
    return errors;
  },
  validatePasswordForm: (form: any) => {
    const errors: Partial<any> = {};
    const { new_login_password, new_parent_password, current_parent_password } =
      form;

    if (new_login_password && new_login_password.length < 8) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (new_parent_password && new_parent_password.length < 8) {
      errors.parent_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (!current_parent_password) {
      errors.curr_parent_password =
        MESSAGES.VALID_PASSWORD.ERROR.CURRENT_PASSWORD.EMPTY;
    }

    return errors;
  },
  validateFolderForm: (form: any) => {
    const errors: Partial<any> = {};
    const { name, parent_id, all_parent } = form;

    if (!name) {
      errors.folder_name = MESSAGES.FOLDER.ERROR.NAME.EMPTY;
    }

    if (name.length > 30) {
      errors.folder_name = MESSAGES.FOLDER.ERROR.NAME.LTE_LENGTH;
    }

    if (parent_id.length === 0 && all_parent === false) {
      errors.parent_id = MESSAGES.FOLDER.ERROR.PARENT_ID.EMPTY;
    }

    return errors;
  },
  validateSignup1PricingForm: (form: any) => {
    const errors: Partial<any> = {};
    const { email, confirm_email, first_name, last_name } = form;

    if (!email) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMPTY;
    }
    if (email && !emailValidation.test(String(email).toLowerCase())) {
      errors.email = MESSAGES.REGISTER.ERROR.EMAIL.EMAIL_VALIDATION;
    }

    if (!confirm_email) {
      errors.confirm_email = MESSAGES.REGISTER.ERROR.CONFIRM_EMAIL.EMPTY;
    }

    if (confirm_email && confirm_email !== email) {
      errors.confirm_email = MESSAGES.REGISTER.ERROR.CONFIRM_EMAIL.INVALID;
    }

    if (!first_name) {
      errors.first_name = MESSAGES.REGISTER.ERROR.FIRST_NAME.EMPTY;
    }
    if (!last_name) {
      errors.last_name = MESSAGES.REGISTER.ERROR.LAST_NAME.EMPTY;
    }

    return errors;
  },

  validateSignup2PricingForm: (form: any) => {
    const errors: Partial<any> = {};
    const {
      mobile_no,
      country,
      state,
      country_code,
      plan_id,
      login_password,
      setting_password,
    } = form;

    if (!mobile_no) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.EMPTY;
    }
    if (mobile_no && !number.test(mobile_no)) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.NUMBER;
    }

    if (mobile_no && mobile_no.length < 10) {
      errors.mobile_no = MESSAGES.REGISTER.ERROR.MOBILE_NO.DIGIT;
    }

    if (!country) {
      errors.country = MESSAGES.REGISTER.ERROR.COUNTRY.EMPTY;
    }

    if (!state) {
      errors.state = MESSAGES.REGISTER.ERROR.STATE.EMPTY;
    }

    if (!country_code) {
      errors.country_code = MESSAGES.REGISTER.ERROR.COUNTRY_CODE.EMPTY;
    }

    if (!plan_id) {
      errors.plan = MESSAGES.REGISTER.ERROR.PLAN_ID.EMPTY;
    }

    if (!reWhiteSp.test(String(login_password).toLowerCase())) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.WHITE_SPACE;
    }

    if (login_password.length < 8) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (
      !smallLetter.test(login_password) ||
      !capitalLetter.test(login_password) ||
      login_password.search(/[0-9]/) < 0 ||
      login_password.search(/[!#_$@%&]/) < 0
    ) {
      errors.login_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }

    if (!login_password) {
      errors.login_password = MESSAGES.REGISTER.ERROR.PASSWORD.EMPTY;
    }

    if (!reWhiteSp.test(String(setting_password).toLowerCase())) {
      errors.setting_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.WHITE_SPACE;
    }

    if (setting_password.length < 8) {
      errors.setting_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.INVALID_LENGTH;
    }

    if (
      !smallLetter.test(setting_password) ||
      !capitalLetter.test(setting_password) ||
      setting_password.search(/[0-9]/) < 0 ||
      setting_password.search(/[!#_$@%&]/) < 0
    ) {
      errors.setting_password =
        MESSAGES.VALID_PASSWORD.ERROR.PASSWORD.STRONG_PASSWORD;
    }

    if (!setting_password) {
      errors.setting_password = MESSAGES.REGISTER.ERROR.PASSWORD.EMPTY;
    }

    return errors;
  },
  validateChallegesForm: (form: any) => {
    const errors: Partial<any> = {};
    const { challenge_name, challenge_id, challenge_order, file, fileURL } =
      form;

    if (!challenge_name) {
      errors.challenge_name =
        MESSAGES.CHALLENGES_MODEL.ERROR.CHALLENGE_NAME.EMPTY;
    }

    if (!challenge_order) {
      errors.challenge_order =
        MESSAGES.CHALLENGES_MODEL.ERROR.CHALLENGE_ORDER.EMPTY;
    }

    if (!challenge_id && !file) {
      errors.file = MESSAGES.CHALLENGES_MODEL.ERROR.FILE.EMPTY;
    }

    return errors;
  },
};

export default Validations;
