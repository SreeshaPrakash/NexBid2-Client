import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/auth/authSlice';
import { refreshToken } from '../services/authService';
import type { RootState } from '../redux/store';

export const usePersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            const timeoutId = setTimeout(() => {
                if (isMounted) {
                    setIsLoading(false);
                    console.warn('Session restoration timed out');
                }
            }, 5000); // 5 second safety timeout

            try {
                // Call refresh endpoint (sends httpOnly cookie automatically)
                const response = await refreshToken();

                if (isMounted && response.user && response.accessToken) {
                    dispatch(setCredentials({
                        user: response.user,
                        accessToken: response.accessToken
                    }));
                }
            } catch (error) {
                console.error('Session restoration failed:', error);
                // User stays logged out - that's fine
            } finally {
                clearTimeout(timeoutId);
                if (isMounted) setIsLoading(false);
            }
        };

        // Only call if we're not already authenticated
        if (!isAuthenticated) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, []); // Empty deps - only run on mount

    return { isLoading };
};