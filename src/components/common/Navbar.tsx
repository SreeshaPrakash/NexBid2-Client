


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { logout as logoutAction, setActiveRole } from '../../redux/slices/auth/authSlice';
import { switchRole as switchRoleApi, logout as logoutApi } from '../../services/authService';
import { Menu, X, Briefcase, User, LogOut, ArrowLeftRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { user, activeRole } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#profile-dropdown-wrapper')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (_) {}
        dispatch(logoutAction());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('activeRole');
        setIsProfileOpen(false);
        navigate('/');
        toast.success('Logged out successfully');
    };

    const handleSwitchRole = async () => {
        if (!user) return;
        setIsSwitching(true);
        const nextRole = activeRole === 'client' ? 'freelancer' : 'client';
        try {
            const response = await switchRoleApi(nextRole);
            if (response.success) {
                const { hasProfile, accessToken, user } = response.data;
                dispatch(setActiveRole({ role: nextRole, hasProfile, accessToken, user }));
                toast.success(`Switched to ${nextRole} role`);
                setIsProfileOpen(false);
                setIsMenuOpen(false);
                if (nextRole === 'freelancer' && hasProfile === false) {
                    navigate('/freelancer/profile/setup');
                } else {
                    navigate('/home');
                }
            } else {
                toast.error(response.message || 'Failed to switch role');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error switching role');
        } finally {
            setIsSwitching(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'How It Works', path: '/#how-it-works' },
        { name: 'Categories', path: '/#categories' },
    ];

    return (
        <>
            <style>{`
                .nb-nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                    height: 64px;
                    display: flex; align-items: center;
                    padding: 0 1.5rem;
                    transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
                    font-family: 'DM Sans', sans-serif;
                }
                .nb-nav.scrolled {
                    background: #111118;
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                }
                .nb-nav.top { background: #111118; border-bottom: 1px solid rgba(255,255,255,0.07); }
                .nb-inner { max-width: 1200px; width: 100%; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
                .nb-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
                .nb-logo-box {
                    width: 30px; height: 30px; border-radius: 8px;
                    background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 14px; color: #000;
                }
                .nb-logo-text { font-weight: 700; font-size: 17px; color: #fff; letter-spacing: -0.3px; }
                .nb-links { display: flex; align-items: center; gap: 2rem; }
                .nb-link {
                    font-size: 14px; font-weight: 450; color: rgba(255,255,255,0.55);
                    text-decoration: none; transition: color 0.2s;
                }
                .nb-link:hover { color: #fff; }
                .nb-actions { display: flex; align-items: center; gap: 10px; }
                .nb-btn-ghost {
                    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
                    color: rgba(255,255,255,0.65); background: none; border: none; cursor: pointer;
                    padding: 7px 14px; border-radius: 8px; text-decoration: none;
                    transition: color 0.2s; display: inline-flex; align-items: center;
                }
                .nb-btn-ghost:hover { color: #fff; }
                .nb-btn-primary {
                    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
                    color: #000; background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
                    border: none; cursor: pointer; padding: 7px 18px; border-radius: 8px;
                    text-decoration: none; transition: opacity 0.2s;
                    display: inline-flex; align-items: center;
                }
                .nb-btn-primary:hover { opacity: 0.85; }
                .nb-btn-outline {
                    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
                    color: rgba(255,255,255,0.7);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.12);
                    cursor: pointer; padding: 6px 14px; border-radius: 8px;
                    transition: border-color 0.2s, background 0.2s;
                    display: inline-flex; align-items: center; gap: 6px;
                }
                .nb-btn-outline:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.09); color: #fff; }
                .nb-btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
                /* Role badge */
                .nb-role-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 3px 10px; border-radius: 100px;
                    font-size: 11px; font-weight: 600; letter-spacing: 0.03em;
                    border: 1px solid;
                }
                .nb-role-client { background: rgba(20,184,166,0.12); color: #5EEAD4; border-color: rgba(20,184,166,0.25); }
                .nb-role-freelancer { background: rgba(167,139,250,0.12); color: #C4B5FD; border-color: rgba(167,139,250,0.25); }
                /* Profile avatar button */
                .nb-avatar-btn {
                    display: flex; align-items: center; gap: 8px; background: none; border: none;
                    cursor: pointer; padding: 5px 8px; border-radius: 9px;
                    transition: background 0.2s;
                }
                .nb-avatar-btn:hover { background: rgba(255,255,255,0.07); }
                .nb-avatar {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 800; color: #000; flex-shrink: 0;
                }
                .nb-avatar-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #fff; }
                /* Dropdown */
                .nb-dropdown {
                    position: absolute; right: 0; top: calc(100% + 10px);
                    width: 210px; background: rgba(18,18,24,0.97);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
                    overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.5);
                    font-family: 'DM Sans', sans-serif;
                }
                .nb-dropdown-header { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); }
                .nb-dropdown-name { font-size: 14px; font-weight: 700; color: #fff; }
                .nb-dropdown-email { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
                .nb-dropdown-item {
                    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
                    padding: 10px 16px; font-family: 'DM Sans', sans-serif;
                    font-size: 14px; color: rgba(255,255,255,0.65);
                    display: flex; align-items: center; gap: 9px;
                    transition: background 0.15s, color 0.15s;
                }
                .nb-dropdown-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
                .nb-dropdown-item:disabled { opacity: 0.5; cursor: not-allowed; }
                .nb-dropdown-item.danger { color: rgba(252,165,165,0.8); }
                .nb-dropdown-item.danger:hover { background: rgba(239,68,68,0.08); color: #FCA5A5; }
                /* Mobile toggle */
                .nb-mobile-toggle {
                    display: none; background: none; border: none; color: rgba(255,255,255,0.7);
                    cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.2s;
                }
                .nb-mobile-toggle:hover { background: rgba(255,255,255,0.07); color: #fff; }
                /* Mobile menu */
                .nb-mobile-menu {
                    position: fixed; top: 64px; left: 0; right: 0;
                    background: rgba(8,8,12,0.97); backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    padding: 1.2rem 1.5rem 1.6rem;
                    font-family: 'DM Sans', sans-serif;
                    display: flex; flex-direction: column; gap: 4px;
                }
                .nb-mobile-link {
                    display: block; padding: 10px 12px; border-radius: 8px;
                    font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.65);
                    text-decoration: none; transition: background 0.15s, color 0.15s;
                }
                .nb-mobile-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
                .nb-mobile-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 10px 0; }
                .nb-mobile-user { display: flex; align-items: center; gap: 10px; padding: 4px 12px 12px; }
                .nb-mobile-actions { display: flex; flex-direction: column; gap: 8px; }
                @media (max-width: 768px) {
                    .nb-links, .nb-actions { display: none !important; }
                    .nb-mobile-toggle { display: flex !important; }
                }
            `}</style>

            <nav className={`nb-nav ${scrolled ? 'scrolled' : 'top'}`}>
                <div className="nb-inner">
                    {/* Logo */}
                    <Link to={user ? '/home' : '/'} className="nb-logo">
                        <div className="nb-logo-box">N</div>
                        <span className="nb-logo-text">NexBid</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="nb-links">
                        {!user && navLinks.map(link => (
                            <a key={link.name} href={link.path} className="nb-link">{link.name}</a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="nb-actions">
                        {user ? (
                            <>
                                <span className={`nb-role-badge ${activeRole === 'freelancer' ? 'nb-role-freelancer' : 'nb-role-client'}`}>
                                    <Shield style={{ width: 10, height: 10 }} />
                                    {activeRole}
                                </span>

                                <div id="profile-dropdown-wrapper" style={{ position: 'relative' }}>
                                    <button className="nb-avatar-btn" onClick={() => setIsProfileOpen(o => !o)}>
                                        <div className="nb-avatar">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="nb-avatar-name">{user.name}</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ transition: 'transform 0.2s', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="nb-dropdown">
                                            <div className="nb-dropdown-header">
                                                <div className="nb-dropdown-name">{user.name}</div>
                                                <div className="nb-dropdown-email">{user.email}</div>
                                            </div>
                                            <button
                                                className="nb-dropdown-item"
                                                onClick={handleSwitchRole}
                                                disabled={isSwitching}
                                            >
                                                <ArrowLeftRight style={{ width: 15, height: 15, flexShrink: 0 }}
                                                    className={isSwitching ? 'animate-spin' : ''} />
                                                Switch to {activeRole === 'client' ? 'Freelancer' : 'Client'}
                                            </button>
                                            

                                            {/* { <Link to="/profile" className="w-full" onClick={() => setIsMenuOpen(false)}>
                                                <button className={`${buttonBase} ${buttonOutline} ${buttonSm} w-full justify-start gap-2`}>
                                                    <User className="h-4 w-4" />
                                                    My Profile
                                                </button>
                                            </Link> } */}


                                            <Link to={`/${activeRole}/profile`} onClick={() => setIsMenuOpen(false)}>
                                                <button className="nb-dropdown-item">
                                                    <User style={{ width: 15, height: 15, flexShrink: 0 }} />
                                                    My Profile
                                                </button>
                                            </Link>


                                            <button className="nb-dropdown-item danger" onClick={handleLogout}>
                                                <LogOut style={{ width: 15, height: 15, flexShrink: 0 }} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="nb-btn-ghost">Log in</button>
                                </Link>
                                <Link to="/signup">
                                    <button className="nb-btn-primary">Sign up free</button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button className="nb-mobile-toggle" onClick={() => setIsMenuOpen(o => !o)}>
                        {isMenuOpen
                            ? <X style={{ width: 22, height: 22 }} />
                            : <Menu style={{ width: 22, height: 22 }} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="nb-mobile-menu">
                    {!user && navLinks.map(link => (
                        <a key={link.name} href={link.path} className="nb-mobile-link"
                            onClick={() => setIsMenuOpen(false)}>{link.name}</a>
                    ))}

                    <hr className="nb-mobile-divider" />

                    {user ? (
                        <>
                            <div className="nb-mobile-user">
                                <div className="nb-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{user.name}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{user.email}</div>
                                </div>
                                <span style={{ marginLeft: 'auto' }}
                                    className={`nb-role-badge ${activeRole === 'freelancer' ? 'nb-role-freelancer' : 'nb-role-client'}`}>
                                    {activeRole}
                                </span>
                            </div>
                            <div className="nb-mobile-actions">
                                <button className="nb-btn-outline" style={{ justifyContent: 'flex-start' }}
                                    onClick={handleSwitchRole} disabled={isSwitching}>
                                    <ArrowLeftRight style={{ width: 15, height: 15 }}
                                        className={isSwitching ? 'animate-spin' : ''} />
                                    Switch to {activeRole === 'client' ? 'Freelancer' : 'Client'}
                                </button>
                                <button onClick={handleLogout}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                                        color: 'rgba(252,165,165,0.85)', textAlign: 'left',
                                        padding: '10px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                    <LogOut style={{ width: 15, height: 15 }} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                            <Link to="/login" style={{ flex: 1 }} onClick={() => setIsMenuOpen(false)}>
                                <button className="nb-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Log in</button>
                            </Link>
                            <Link to="/signup" style={{ flex: 1 }} onClick={() => setIsMenuOpen(false)}>
                                <button className="nb-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign up</button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;



