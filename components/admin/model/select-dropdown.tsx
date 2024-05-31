import * as React from 'react';
import { Button, 
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    FormControlLabel, 
    Radio, 
    RadioGroup 
} from "@mui/material";
import { countries } from '../../../helpers/country-data';

const options = [
    'India',
    'US'
];

interface Props {
    id: string;
    keepMounted: boolean;
    value: string;
    open: boolean;
    onClose: (value?: string) => void;
}
const SelectCountryModel = (props: Props) => {
    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef<HTMLElement>(null);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
        >
            <DialogTitle>Select Country</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    ref={radioGroupRef}
                    aria-label="ringtone"
                    name="ringtone"
                    value={value}
                    onChange={handleChange}
                >
                    {countries.map((option) => (
                        <FormControlLabel
                            value={option.label.toLowerCase()}
                            key={option.code}
                            control={<Radio />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SelectCountryModel;