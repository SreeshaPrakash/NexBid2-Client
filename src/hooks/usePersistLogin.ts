import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/auth/authSlice';
import { setAdminCredentials } from '../redux/slices/admin/adminAuthSlice';
import { refreshToken } from '../services/authService';
import type { RootState } from '../redux/store';

export const usePersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAdminAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);

    useEffect(() => {
        let isMounted = true;

        const verifySession = async () => {
            const timeoutId = setTimeout(() => {
                if (isMounted) {
                    setIsLoading(false);
                    console.warn('Session restoration timed out');
                }
            }, 5000);

            try {
                // If we're already authenticated in either, skip
                if (!isAuthenticated && !isAdminAuthenticated) {
                    const response = await refreshToken();
                    
                    if (isMounted && response.user && response.accessToken) {
                        const userRoles = response.user.roles || [];
                        const isAdmin = userRoles.includes('admin');
                        
                        // We check the stored adminUser to see if we were previously logged in as admin
                        const storedAdminUser = localStorage.getItem('adminUser');
                        
                        if (isAdmin && storedAdminUser) {
                            dispatch(setAdminCredentials({
                                user: response.user,
                                accessToken: response.accessToken
                            }));
                        } else {
                            dispatch(setCredentials({
                                user: response.user,
                                accessToken: response.accessToken
                            }));
                        }
                    }
                }
            } catch {
                // Silent fail for persistence
            } finally {
                clearTimeout(timeoutId);
                if (isMounted) setIsLoading(false);
            }
        };

        verifySession();

        return () => {
            isMounted = false;
        };
    }, [dispatch, isAdminAuthenticated, isAuthenticated]);

    return { isLoading };
};