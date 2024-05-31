import {createTheme, colors } from "@mui/material";
import { palette } from "@mui/system";

const mdTheme = createTheme({
  palette: {
    action: {
      active: "#000",
    },
    background: {
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: '#000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fff',
      contrastText: colors.common.white,
    },
    text: {
      primary: "#000",
      secondary: "#fff",
    },
    success: {
      main: '#14B8A6',
      light: '#43C6B7',
      dark: '#0E8074',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#2196F3',
      light: '#64B6F7',
      dark: '#0B79D0',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FFB020',
      light: '#FFBF4C',
      dark: '#B27B16',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#ff3333',
      light: '#DA6868',
      dark: '#922E2E',
      contrastText: '#FFFFFF'
    },
  },
  typography: {
    fontFamily: [
      "Poppins",
    ].join(','),
    
    button: {
      textTransform: "none"
    },
    h5:{
      font: "normal normal bold 28px/42px Poppins",
      color: "#040404",
      textAlign: "left"
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.375
    },
    body1: {
      color: "#000000",
      fontSize: "0.8rem"
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    caption: {
      color: "black"
    }
  },
  components: {
    MuiTableSortLabel:{
      styleOverrides:{
        root:{
          '&.Mui-active':{
            '& .MuiTableSortLabel-icon': {
              opacity: 1,
              color: "#000"
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides:{
        text: {
          "&:hover":{            
            backgroundColor: "rgba(225,225,225,0.2)"
          }
        },
        contained: {
          "&:hover":{
            color: "#99FD31",
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          font: "normal normal normal 14px/21px Poppins",
          // this is styles for the new variants
          "& fieldset": {
            border: "1px solid #000"
          },
          "& .MuiInputBase-input":{
            paddingTop: "10px",
            paddingBottom: "10px"
          },
          "& .MuiInputBase-input:hover + fieldset": {
            border: `2px solid #000`
          },
          "& .MuiInputBase-input:focus + fieldset": {
            border: `2px solid #000`
          }
        }
      }
    },
    MuiOutlinedInput:{
      styleOverrides: {
        root: {
          font: "normal normal normal 14px/21px Poppins",
          // this is styles for the new variants
          "& fieldset": {
            border: "1px solid #000"
          },
         
          "& .MuiInputBase-input":{
            paddingTop: "10px",
            paddingBottom: "10px"
          },
          "& .MuiInputBase-input:hover + fieldset": {
            border: `2px solid #000`
          },
          "& .MuiInputBase-input:focus + fieldset": {
            border: `2px solid #000`
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginRight: "6px",
        }
      }
    },
    MuiRadio: {
      styleOverrides:{
        root: {
          color: 'black',
          ' &.Mui-checked': {
            color: 'green',
          },
        },
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          font: "Poppins",
          color: '#fff',

          fontWeight: 600,
          ' &.Mui-selected': {
            color: '#99FD31',
            // color: "black"
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root:{
          borderTopLeftRadius:"8px",
          borderTopRightRadius:"8px",
          backgroundColor:"black",
          "& MuiButtonBase-root": {
            color: "#fff"
          }
        },
        indicator: {
          backgroundColor: '#99FD31',
          // backgroundColor: '#000000',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          h6: {
            font: "Poppins",
            color: "#040404",
          },

          table: {
            thead: {
              tr: {
                th: {
                  '&.MuiTableCell-root': {
                  
                    borderBottom: '1px solid grey',
                  },
                }
              }
            },
            tbody:{
              tr:{
                td:{
                  '&.MuiTableCell-root':{
                    fontWeight: 500,
                    font: "Poppins",
                    color: "#040404",
                    borderBottom: '1px solid #d3d3d3'
                  }
                }
              }
            }
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked':{
              color: "#3f51b5",
          },
          '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':{
              backgroundColor: '#3f51b5',
          },
        }
      }
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: "#3F4652"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root:{
          color: "gray",
          borderRadius: "100%",
          "&:hover":{            
            backgroundColor: "rgba(229,231,235,1)",
          }
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        },
        subheaderTypographyProps: {
          variant: 'subtitle1',
          color: 'black'
        }
      },
      styleOverrides: {
        root: {
          padding: '22px 22px'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
            marginLeft: "0px",
            marginRight: "0px"
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: "#d32f2f",
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "0px"
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        loading:{
          color: "black"
        },
        noOptions: {
          color: "black"
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#000"
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            // border: "4px",
            fontWeight: "Bold"
          },
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#99FD31",
            "&:hover": {
              backgroundColor: "#99FD31",
            }
          }
        }
      }
    }
  },
});

export {
    mdTheme
}