const MESSAGES = {
  //login
  LOGIN: {
    ERROR: {
      EMAIL: {
        EMPTY: "Email is required.",
        EMAIL_VALIDATION: "Please enter valid email address",
      },
      PASSWORD: {
        EMPTY: "Password is required.",
        STRONG_PASSWORD: "Please enter valid password.",
      },
    },
  },
  //register
  REGISTER: {
    ERROR: {
      FIRST_NAME: {
        EMPTY: "Please enter first name.",
        INVALID: "Please enter valid first name",
        WHITE_SPACE: "Name should not contain space",
      },
      LAST_NAME: {
        EMPTY: "Please enter last name.",
        INVALID: "Please enter valid last name",
        WHITE_SPACE: "Name should not contain space",
      },
      EMAIL: {
        EMPTY: "Please enter email.",
        EMAIL_VALIDATION: "Please enter valid email address",
      },
      CONFIRM_EMAIL: {
        EMPTY: "Please enter confirm email.",
        INVALID: "Emails don't match",
      },
      MOBILE_NO: {
        EMPTY: "Please enter mobile number.",
        NUMBER: "Please enter only number.",
        DIGIT: "Please enter valid mobile number.",
      },
      STREET_1: {
        EMPTY: "Please enter street 1.",
      },
      STREET_2: {
        EMPTY: "Please enter street 2.",
      },
      ADDRESS: {
        EMPTY: "Please enter address.",
        INVALID: "Please enter valid address.",
        WHITE_SPACE: "Address should not contain space",
      },
      APARTMENT_NO: {
        EMPTY: "Please enter apartment,suite,unit.",
        INVALID: "Please enter valid apartment_no.",
        WHITE_SPACE: "This field should not contain space",
      },
      SUBURB: {
        EMPTY: "Please enter suburb.",
        INVALID: "Please enter valid suburb.",
        WHITE_SPACE: "Suburb should not contain space",
      },
      COUNTRY: {
        EMPTY: "Please select country.",
      },
      STATE: {
        EMPTY: "Please select state.",
      },
      COUNTRY_CODE: {
        EMPTY: "Please select country code.",
      },
      POSTAL_CODE: {
        EMPTY: "Please select postal code.",
        INVALID: "Please enter valid postal code.",
        LENGTH_INVALID: "Postal code length must be less than 6 numbers.",
      },
      PASSWORD: {
        EMPTY: "Please enter password.",
        STRONG_PASSWORD: "Please enter valid password.",
      },
      TERM_CONDITION: {
        EMPTY: "Agree to T&Cs to continue",
      },
      PARENT_ID: {
        EMPTY: "Parent id is required",
      },
      PLAN_ID: {
        EMPTY: "Plan is required",
      },
    },
  },
  //add child
  CHILD: {
    ERROR: {
      NAME: {
        EMPTY: "Please enter full name.",
        INVALID: "Please enter valid full name",
        WHITE_SPACE: "Name should not contain space",
      },
      DOB: {
        EMPTY: "Please enter date of birth.",
        DOB_VALIDATION: "Please enter valid birth date",
      },
      GENDER: {
        EMPTY: "Please select gender.",
      },
      SCHOOL_NAME: {
        EMPTY: "Please enter school name.",
      },
      COUNTRY: {
        EMPTY: "Please select country.",
      },
      CLASS: {
        EMPTY: "Please select class.",
      },
      STAGE: {
        EMPTY: "Please select stage.",
      },
      VIDEO_COUNT: {
        EMPTY: "Please select no of video.",
      },
    },
  },
  VALID_PASSWORD: {
    ERROR: {
      EMAIL: {
        EMPTY: "Email is required.",
        EMAIL_VALIDATION: "Please enter valid email address",
      },
      PASSWORD: {
        EMPTY: "Password is required.",
        STRONG_PASSWORD:
          "Password must contain Number, Upper, Lower And One Special Character",
        INVALID_LENGTH: "Password must be at least 8 characters.",
        SMALL_LETTER: "Your password must contain at least one small letter.",
        CAPITAL_LETTER:
          "Your password must contain at least one capital letter.",
        DIGIT: "Your password must contain at least one digit.",
        SPECIAL_CHARACTERS:
          "Your password must contain at least one special characters.",
        WHITE_SPACE: "Password should not contain space",
      },
      CPASSWORD: {
        EMPTY: "Please enter confirm password.",
        CONFIRM_PASS_VALIDATION: "Confirm password shoud be same as password.",
      },
      PARENT_PASSWORD: {
        INVALID:
          "Sorry but that password doesn’t seem to be correct. Please check and try again",
      },
      CURRENT_PASSWORD: {
        EMPTY: "Required to change any password",
      },
    },
  },
  ADMIN_EDIT: {
    ERROR: {
      NAME: {
        EMPTY: "Please enter name.",
      },
      EMAIL: {
        EMPTY: "Please enter email.",
        EMAIL_VALIDATION: "Please enter valid email address",
      },
      OLD_PASSWORD: {
        EMPTY: "Please enter old password.",
      },
    },
  },
  VACATION: {
    ERROR: {
      TITLE: {
        EMPTY: "Please enter Title.",
      },
      COUNTRY: {
        EMPTY: "Please select country.",
      },
      DATE_PICKER: {
        EMPTY: "Please select start date and end date.",
      },
    },
  },
  WORKSHEET_MODEL: {
    ERROR: {
      TITLE: {
        EMPTY: "Title must be required.",
      },
      DESCRIPTION: {
        EMPTY: "Description must be required.",
      },
      FILE: {
        EMPTY: "File must be required.",
      },
    },
  },
  RESOURCEDOC_MODEL: {
    ERROR: {
      PARENT_ID: {
        EMPTY: "Parent must be required.",
      },
      VIDEO_ID: {
        EMPTY: "Video must be required.",
      },
      FOLDER_ID: {
        EMPTY: "Folder Id must be required.",
      },
      FILE: {
        EMPTY: "File must be required.",
      },
    },
  },
  MAPPING_LESSON: {
    ERROR: {
      LESSON: {
        EMPTY: "Lesson must be required.",
      },
      WORKSHEET: {
        EMPTY: "Worksheet must be required.",
      },
      CATEGORY: {
        EMPTY: "Category must be required.",
      },
      STAGE: {
        EMPTY: "Stage must be required.",
      },
      LESSON_NO: {
        EMPTY: "lesson no must be required.",
        INVALID: "This lesson no is already assign.",
      },
    },
  },
  VIDEO_FORM: {
    ERROR: {
      TITLE: {
        EMPTY: "Title must be required.",
      },
      DESCRIPTION: {
        EMPTY: "Description must be required.",
      },
    },
  },
  DISCOUNT_CODE: {
    ERROR: {
      NAME: {
        EMPTY: "Name must be required.",
      },
      CODE: {
        EMPTY: "Discount code must be required.",
      },
      CURRENCY: {
        EMPTY: "Currency must be required.",
      },
      AMOUNT: {
        EMPTY: "Amount must be required.",
      },
      EXPIRY_DATE: {
        EMPTY: "Expiry date must be required.",
      },
      DURATION_IN_MONTH: {
        EMPTY: "Duration months field must be required.",
      },
      SUBSCRIPTION_PLAN: {
        EMPTY: "Subscription plan must be required.",
      },
    },
  },
  ADD_PLAN: {
    ERROR: {
      TITLE: {
        EMPTY: "Title must be required.",
      },
      SUBTITLE: {
        EMPTY: "Subtitle must be required.",
      },
      NO_OF_STUDENT: {
        EMPTY: "No of student must be required.",
        ONLYT_NUMBER: "No of student can contain only numbers.",
      },
      AMOUNT: {
        EMPTY: "Amount must be required.",
        INVALID_AMOUNT: "Please enter valid amount.",
      },
      DESCRIPTION: {
        EMPTY: "Description must be required.",
      },
    },
  },
  FOLDER: {
    ERROR: {
      NAME: {
        EMPTY: "Name must be required.",
        LTE_LENGTH: "Name must be less than 30 character.",
      },
      PARENT_ID: {
        EMPTY: "Parent must be required.",
      },
    },
  },
  SIGNUP1_PRICING: {
    ERROR: {
      EMAIL: {
        EMPTY: "Email is required.",
        EMAIL_VALIDATION: "Please enter valid email address",
      },
      FULLNAME: {
        EMPTY: "Full name is required.",
      },
    },
  },
  CHALLENGES_MODEL: {
    ERROR: {
      CHALLENGE_NAME: {
        EMPTY: "Challenge name must be required.",
      },
      CHALLENGE_ORDER: {
        EMPTY: "Challenge order must be required.",
      },
      FILE: {
        EMPTY: "File must be required.",
      },
    },
  },
};

export default MESSAGES;
