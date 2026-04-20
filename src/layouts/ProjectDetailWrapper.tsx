import React from 'react';
import { useAppSelector } from '../redux/hooks';
import ClientLayout from './ClientLayout';
import FreelancerLayout from './FreelancerLayout';
import { Outlet } from 'react-router-dom';

const ProjectDetailWrapper: React.FC = () => {
    const activeRole = useAppSelector((state) => state.auth.activeRole);

    if (activeRole === 'freelancer') {
        return (
            <FreelancerLayout>
                <div className="py-8">
                    <Outlet />
                </div>
            </FreelancerLayout>
        );
    }

    // Default to ClientLayout
    return (
        <ClientLayout>
            <div className="py-8">
                <Outlet />
            </div>
        </ClientLayout>
    );
};

export default ProjectDetailWrapper;
