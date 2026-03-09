import React, { type ReactNode } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FreelancerSidebar from '../components/freelancer/FreelancerSidebar';

interface FreelancerLayoutProps {
    children: ReactNode;
}

const FreelancerLayout: React.FC<FreelancerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#fbfcfd]">
            <Navbar />
            <div className="flex flex-grow mt-[64px]">
                {/* Fixed Sidebar */}
                <FreelancerSidebar />
                
                {/* Main Content Area - Offset by sidebar width on desktop */}
                <main className="flex-grow md:ml-64 w-full relative min-h-full">
                    {children}
                </main>
            </div>
             {/* Footer offset by sidebar width */}
             <div className="md:ml-64">
                <Footer />
            </div>
        </div>
    );
};

export default FreelancerLayout;
