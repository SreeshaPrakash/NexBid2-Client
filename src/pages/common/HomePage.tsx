import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import ClientDashboard from '../../components/client/ClientDashboard';
import FreelancerDashboard from '../../components/freelancer/FreelancerDashboard';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const HomePage: React.FC = () => {
    const { user, activeRole, hasFreelancerProfile } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && activeRole === 'freelancer' && hasFreelancerProfile === false) {
            navigate('/freelancer/setup-profile');
        }
    }, [user, activeRole, hasFreelancerProfile, navigate]);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                {activeRole === 'freelancer' ? (
                    <FreelancerDashboard />
                ) : (
                    <ClientDashboard />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
