import { Box } from '@mui/material';
import * as React from 'react';
import ParentSettingsLayout from '../../components/parent-setting/parent-settings-layout';
import PaymentMethod from '../../components/payment-method/payment-method';
import Auth from '../../config/auth';

function PaymentMethodLayout() {

    return (
        <ParentSettingsLayout>
            <Box sx={{ m: { xs: 1, sm: 2, md: 4, lg: 4 } }}>
                <PaymentMethod />
            </Box>
        </ParentSettingsLayout>
    )
}

export default Auth(PaymentMethodLayout);