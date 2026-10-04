import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import Landing from '../../components/common/Landing';
import { UserRoute } from '../../constants/routeConstansts';

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        return <Navigate to={UserRoute.HOME} replace />;
    }

    return <Landing />;
};

export default LandingPage;




