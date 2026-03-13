import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import Landing from '../../components/common/Landing';

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return <Landing />;
};

export default LandingPage;




