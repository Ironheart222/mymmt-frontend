import * as React from 'react';
import ParentSettingsLayout from '../../components/parent-setting/parent-settings-layout';
import PricingTable from '../../components/pricing/pricing-table';
import Auth from '../../config/auth';

function SubscriptionPlan() {

    return (
        <ParentSettingsLayout>
            <PricingTable />
        </ParentSettingsLayout>
    )
}

export default Auth(SubscriptionPlan);