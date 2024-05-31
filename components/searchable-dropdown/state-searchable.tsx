import * as React from 'react';
import { Box, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import Autocomplete, {
    AutocompleteCloseReason,
    autocompleteClasses,
    createFilterOptions
} from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { StateType } from '../../store/Interface';

interface PopperComponentProps {
    anchorEl?: any;
    disablePortal?: boolean;
    open: boolean;
}

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13,
    },
    [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
            minHeight: 'auto',
            alignItems: 'flex-start',
            padding: 8,
            borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'
                }`,
            '&[aria-selected="true"]': {
                backgroundColor: 'transparent',
            },
            [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
            {
                backgroundColor: theme.palette.action.hover,
            },
        },
    },
    [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: 'relative',
    },
}));

const StyledPopper = styled(Popper)(({ theme }) => ({
    boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'
        }`,
    width: 200,
    zIndex: theme.zIndex.modal,
    color: '#24292e',
    backgroundColor: '#fff',
    borderRadius: "0 0 3px 3px"
}));


const StyledInput = styled(InputBase)(({ theme }) => ({
    width: '70%',
    '& input': {
        borderRadius: "3px",
        padding: "3px 8px 3px",
        border: "1px solid #cacaca",
        fontSize: "13px",
        lineHeight: "15px",
        marginLeft: "6px",
        outline: "none",
    },
}));

function PopperComponent(props: PopperComponentProps) {
    const { disablePortal, anchorEl, open, ...other } = props;
    return <StyledAutocompletePopper {...other} />;
}

const filterOptions = createFilterOptions({
    stringify: (option: StateType) => `${option.name} ${option.state_code}`,
});

const stateData = {
    id: "",
    latitude: "",
    longitude: "",
    name: "",
    state_code: "",
    type: ""
}

export default function StateSearchable(props: any) {
    let { name, options, onClose, anchorEl, value, handleOnChange } = props;
    const open = Boolean(anchorEl);

    const handleClose = () => {
        onClose();
    };

    return (
        <StyledPopper open={open} anchorEl={anchorEl} placement="bottom-start">
            <ClickAwayListener onClickAway={handleClose}>
                <div className='custom-autocomplete-popper'>
                    <Autocomplete
                        open
                        onClose={(
                            event: React.ChangeEvent<{}>,
                            reason: AutocompleteCloseReason,
                        ) => {
                            if (reason === 'escape') {
                                handleClose();
                            }
                        }}
                        value={stateData.id == "" ? null : stateData}
                        onChange={(event, newValue, reason) => {
                            if (
                                event.type === 'keydown' ||
                                event.type === 'click'
                                // (event as React.KeyboardEvent).key === 'Backspace' &&
                                // reason === 'removeOption'
                            ) {
                                handleOnChange(name, newValue);
                                onClose();
                            } else {
                                return;
                            }
                        }}
                        disableCloseOnSelect
                        filterOptions={filterOptions}
                        PopperComponent={PopperComponent}
                        noOptionsText="No Country"
                        renderOption={(props, option, { selected }) => (
                            <li {...props} style={{ border: "none" }}>
                                <Box sx={{ width: "100%" }}> {/* '&:hover': { color: "#99FD31" } */}
                                    {option.name} <span style={{ color: "#6B6B6B" }}>({option.state_code})</span>
                                </Box>
                            </li>
                        )}
                        options={options}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <Box sx={{ width: "100%", p: "10px 0 6px 10px", mb: 1 }}>
                                <span className="search-emoji" style={{ fontSize: "15px" }} role="img" aria-label="Magnifying glass">🔎</span>
                                <StyledInput
                                    ref={params.InputProps.ref}
                                    inputProps={params.inputProps}
                                    autoFocus
                                    placeholder="search"
                                />
                            </Box>
                        )}
                    />
                </div>
            </ClickAwayListener>
        </StyledPopper>
    );
}