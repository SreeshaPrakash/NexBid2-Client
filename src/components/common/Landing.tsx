
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, Handshake, Users, Briefcase, Code, PenTool, Edit3, Globe, Database, Video } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    // ── Animated counters ───────────────────────────────────────────────
    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);

    useEffect(() => {
        const animate = (setter: (v: number) => void, target: number, duration = 1800) => {
            const steps = duration / 16;
            const step = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                setter(Math.floor(current));
                if (current >= target) clearInterval(timer);
            }, 16);
        };
        const t = setTimeout(() => {
            animate(setCount1, 48000);
            animate(setCount2, 12000);
            animate(setCount3, 98);
        }, 500);
        return () => clearTimeout(t);
    }, []);

    const howItWorksSteps = [
        {
            icon: <ClipboardList style={{ width: 20, height: 20 }} />,
            title: 'Post a Project',
            description: 'Tell us your project budget and timeline. Get started in minutes.',
            tag: 'For Clients',
        },
        {
            icon: <Handshake style={{ width: 20, height: 20 }} />,
            title: 'Get Bids',
            description: 'Receive competitive proposals from skilled freelancers worldwide.',
            tag: 'For Clients',
        },
        {
            icon: <Users style={{ width: 20, height: 20 }} />,
            title: 'Hire & Collaborate',
            description: 'Choose your ideal talent, manage work, and communicate efficiently.',
            tag: 'Both',
        },
        {
            icon: <Briefcase style={{ width: 20, height: 20 }} />,
            title: 'Get Work Done',
            description: 'Approve deliverables, release payment, and achieve your goals.',
            tag: 'For Freelancers',
        },
    ];

    const categories = [
        { name: 'Web Development', icon: <Code style={{ width: 20, height: 20 }} /> },
        { name: 'UI/UX Design', icon: <PenTool style={{ width: 20, height: 20 }} /> },
        { name: 'Content Writing', icon: <Edit3 style={{ width: 20, height: 20 }} /> },
        { name: 'Digital Marketing', icon: <Globe style={{ width: 20, height: 20 }} /> },
        { name: 'AI & Data Science', icon: <Database style={{ width: 20, height: 20 }} /> },
        { name: 'Video Editing', icon: <Video style={{ width: 20, height: 20 }} /> },
    ];

    const testimonials = [
        {
            quote: "NexBid helped me find an amazing developer who brought my vision to life quickly and efficiently. The bidding process was straightforward, and collaboration was seamless.",
            author: "Michael Lee",
            role: "Client, Startup Founder",
            avatar: "ML",
            rating: 5,
        },
        {
            quote: "As a freelancer, this platform has been a game-changer. I've connected with incredible clients and found projects that truly match my skills. The payment system is secure and reliable.",
            author: "Sarah Kim",
            role: "Freelancer, Graphic Designer",
            avatar: "SK",
            rating: 5,
        },
        {
            quote: "Our marketing team needed a content writer with specific industry knowledge, and NexBid delivered. We found a top-tier professional who exceeded our expectations.",
            author: "James Brown",
            role: "Client, Marketing Manager",
            avatar: "JB",
            rating: 4,
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');

                *, *::before, *::after { box-sizing: border-box; }
                html { scroll-behavior: smooth; }

                .ld-root {
                    min-height: 100vh;
                    background: #08080C;
                    font-family: 'DM Sans', sans-serif;
                    color: #fff;
                    -webkit-font-smoothing: antialiased;
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulseDot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.35; }
                }

                /* ── Hero ── */
                .ld-hero {
                    min-height: 100vh;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    padding: 120px 2rem 80px;
                    position: relative; overflow: hidden;
                    text-align: center;
                }
                .ld-hero-bg {
                    position: absolute; inset: 0; z-index: 0;
                    background:
                        radial-gradient(ellipse 80% 55% at 50% -5%, rgba(59,130,246,0.18) 0%, transparent 70%),
                        radial-gradient(ellipse 55% 40% at 85% 65%, rgba(110,231,183,0.10) 0%, transparent 60%);
                }
                .ld-hero-grid {
                    position: absolute; inset: 0; z-index: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
                .ld-hero-inner { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; width: 100%; }

                .ld-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 14px; border-radius: 100px;
                    border: 1px solid rgba(110,231,183,0.3);
                    background: rgba(110,231,183,0.07);
                    margin-bottom: 1.8rem;
                    animation: fadeInDown 0.6s ease both;
                }
                .ld-badge-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #6EE7B7; box-shadow: 0 0 8px #6EE7B7;
                    display: inline-block;
                    animation: pulseDot 2s ease infinite;
                }
                .ld-badge-text { font-size: 13px; color: #6EE7B7; font-weight: 500; letter-spacing: 0.02em; }

                .ld-h1 {
                    font-size: clamp(2.6rem, 6vw, 4.8rem);
                    font-weight: 800; line-height: 1.08;
                    letter-spacing: -0.04em; color: #fff;
                    margin: 0 0 1.4rem;
                    animation: fadeInUp 0.7s 0.1s ease both;
                }
                .ld-h1-accent {
                    background: linear-gradient(90deg, #6EE7B7 0%, #3B82F6 60%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .ld-subhead {
                    font-size: clamp(1rem, 2vw, 1.15rem);
                    color: rgba(255,255,255,0.5); line-height: 1.7;
                    max-width: 520px; margin: 0 auto 2.4rem;
                    animation: fadeInUp 0.7s 0.2s ease both;
                }

                
                .ld-search-wrap {
                    display: flex;
                    gap: 10px;
                    max-width: 540px;
                    margin: 0 auto 3.5rem;
                    justify-content: center;   /* add this */
                    align-items: center;       /* optional but good */
                    animation: fadeInUp 0.7s 0.28s ease both;
}
                    
                .ld-search-input-wrap { flex: 1; position: relative; }
                .ld-search-icon {
                    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
                    color: rgba(255,255,255,0.3); pointer-events: none;
                    display: flex; align-items: center;
                }
                .ld-search-input {
                    width: 100%; height: 48px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px; padding: 0 14px 0 42px;
                    font-family: 'DM Sans', sans-serif; font-size: 14px;
                    color: #fff; outline: none;
                    transition: border-color 0.2s, background 0.2s;
                }
                .ld-search-input::placeholder { color: rgba(255,255,255,0.3); }
                .ld-search-input:focus {
                    border-color: rgba(110,231,183,0.4);
                    background: rgba(255,255,255,0.09);
                }
                .ld-search-btn {
                    height: 48px; padding: 0 22px; border-radius: 10px; flex-shrink: 0;
                    background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
                    border: none; cursor: pointer;
                    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; color: #000;
                    white-space: nowrap;
                    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(59,130,246,0.3);
                }
                .ld-search-btn:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(59,130,246,0.4); }

                .ld-stats {
                    display: flex; gap: clamp(1.5rem, 4vw, 4rem); justify-content: center; flex-wrap: wrap;
                    animation: fadeInUp 0.7s 0.4s ease both;
                }
                .ld-stat-val { font-size: clamp(1.7rem, 3vw, 2.2rem); font-weight: 800; color: #fff; letter-spacing: -0.03em; }
                .ld-stat-label { font-size: 13px; color: rgba(255,255,255,0.38); margin-top: 3px; }

                /* ── Shared section styles ── */
                .ld-section { padding: 100px 2rem; }
                .ld-section-alt { background: rgba(255,255,255,0.015); }
                .ld-section-inner { max-width: 1200px; margin: 0 auto; }
                .ld-section-inner-md { max-width: 900px; margin: 0 auto; }
                .ld-section-head { text-align: center; margin-bottom: 4rem; }
                .ld-section-tag {
                    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
                    text-transform: uppercase; color: #6EE7B7;
                }
                .ld-section-title {
                    font-size: clamp(2rem, 4vw, 2.9rem); font-weight: 800;
                    color: #fff; letter-spacing: -0.03em; margin: 12px 0 0;
                }

                /* ── How It Works ── */
                .ld-steps { display: flex; flex-direction: column; }
                .ld-step {
                    display: flex; gap: 2rem; align-items: flex-start;
                    padding: 2rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .ld-step:last-child { border-bottom: none; }
                .ld-step-num {
                    font-size: 12px; font-weight: 700;
                    color: rgba(255,255,255,0.15); letter-spacing: 0.06em;
                    min-width: 36px; padding-top: 4px; flex-shrink: 0;
                }
                .ld-step-icon {
                    width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.55);
                    transition: background 0.2s, border-color 0.2s, color 0.2s;
                }
                .ld-step:hover .ld-step-icon {
                    background: rgba(59,130,246,0.12);
                    border-color: rgba(59,130,246,0.28);
                    color: #93C5FD;
                }
                .ld-step-body { flex: 1; }
                .ld-step-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 7px; }
                .ld-step-title { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
                .ld-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.04em; }
                .ld-tag-client { background: rgba(59,130,246,0.14); color: #93C5FD; }
                .ld-tag-freelancer { background: rgba(110,231,183,0.12); color: #6EE7B7; }
                .ld-tag-both { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.45); }
                .ld-step-desc { font-size: 14px; color: rgba(255,255,255,0.42); line-height: 1.65; margin: 0; }

                /* ── Categories ── */
                .ld-cat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 16px; overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.06);
                }
                .ld-cat-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 1.3rem 1.6rem;
                    background: #08080C; cursor: pointer;
                    transition: background 0.22s;
                }
                .ld-cat-item:hover { background: rgba(59,130,246,0.06); }
                .ld-cat-icon-box {
                    width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.5);
                    transition: background 0.22s, border-color 0.22s, color 0.22s;
                }
                .ld-cat-item:hover .ld-cat-icon-box {
                    background: rgba(110,231,183,0.12);
                    border-color: rgba(110,231,183,0.25);
                    color: #6EE7B7;
                }
                .ld-cat-name { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.78); transition: color 0.22s; }
                .ld-cat-item:hover .ld-cat-name { color: #fff; }

                /* ── Testimonials ── */
                .ld-testi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1rem;
                }
                .ld-testi-card {
                    padding: 1.8rem; border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.07);
                    background: rgba(255,255,255,0.025);
                    transition: border-color 0.25s, transform 0.25s;
                }
                .ld-testi-card:hover { border-color: rgba(110,231,183,0.2); transform: translateY(-3px); }
                .ld-testi-stars { color: #FBBF24; font-size: 13px; letter-spacing: 1px; margin-bottom: 1rem; }
                .ld-testi-quote {
                    font-size: 14.5px; color: rgba(255,255,255,0.65);
                    line-height: 1.7; font-style: italic; margin: 0 0 1.4rem;
                }
                .ld-testi-author { display: flex; align-items: center; gap: 10px; }
                .ld-testi-avatar {
                    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
                    background: linear-gradient(135deg, #6EE7B7, #3B82F6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 800; color: #000;
                }
                .ld-testi-name { font-size: 14px; font-weight: 700; color: #fff; }
                .ld-testi-role { font-size: 12px; color: rgba(255,255,255,0.32); }

                /* ── CTA ── */
                .ld-cta-section { padding: 60px 2rem 100px; }
                .ld-cta-box {
                    max-width: 900px; margin: 0 auto; border-radius: 20px;
                    background: linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(110,231,183,0.09) 100%);
                    border: 1px solid rgba(110,231,183,0.15);
                    padding: clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem);
                    text-align: center; position: relative; overflow: hidden;
                }
                .ld-cta-glow {
                    position: absolute; inset: 0; pointer-events: none;
                    background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(59,130,246,0.07), transparent);
                }
                .ld-cta-title {
                    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800;
                    color: #fff; letter-spacing: -0.03em; margin: 0 0 1rem; position: relative;
                }
                .ld-cta-sub {
                    font-size: 15px; color: rgba(255,255,255,0.48);
                    max-width: 440px; margin: 0 auto 2rem; line-height: 1.65; position: relative;
                }
                .ld-cta-btn {
                    display: inline-flex; align-items: center;
                    height: 48px; padding: 0 28px; border-radius: 10px;
                    background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
                    border: none; cursor: pointer;
                    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; color: #000;
                    box-shadow: 0 4px 22px rgba(59,130,246,0.32);
                    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
                    text-decoration: none; position: relative;
                }
                .ld-cta-btn:hover { opacity: 0.87; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(59,130,246,0.42); }

                /* ── Responsive ── */
                @media (max-width: 580px) {
                    .ld-search-wrap { flex-direction: column; }
                    .ld-search-btn { height: 44px; width: 100%; }
                    .ld-step { gap: 1rem; }
                    .ld-step-num { display: none; }
                }
            `}</style>

            <div className="ld-root">
                <Navbar />

                <main>
                    {/* ── Hero ── */}
                    <section className="ld-hero">
                        <div className="ld-hero-bg" />
                        <div className="ld-hero-grid" />

                        <div className="ld-hero-inner">
                            {/* <div className="ld-badge">
                                <span className="ld-badge-dot" />
                                <span className="ld-badge-text">Now in open beta — join 48,000+ users</span>
                            </div> */}

                            <h1 className="ld-h1">
                                Hire the Right Talent or<br />
                                <span className="ld-h1-accent">Get Hired — Seamlessly.</span>
                            </h1>

                            <p className="ld-subhead">
                                A smart marketplace where clients meet skilled freelancers to work, connect, and grow.
                            </p>

                            {/* Search bar — original Get Started functionality */}
                            <div className="ld-search-wrap">
                                {/* <div className="ld-search-input-wrap">
                                    <span className="ld-search-icon">
                                        <Search style={{ width: 17, height: 17 }} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search for projects or freelancers..."
                                        className="ld-search-input"
                                    />
                                </div> */}
                                <button 
                                    className="ld-search-btn"
                                    onClick={() => navigate('/login')}
                                >
                                    Get Started
                                </button>
                            </div>

                            <div className="ld-stats">
                                {[
                                    { val: `${count1.toLocaleString()}+`, label: 'Registered users' },
                                    { val: `${count2.toLocaleString()}+`, label: 'Projects completed' },
                                    { val: `${count3}%`, label: 'Client satisfaction' },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: 'center' }}>
                                        <div className="ld-stat-val">{s.val}</div>
                                        <div className="ld-stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── How It Works ── */}
                    <section id="how-it-works" className="ld-section ld-section-alt">
                        <div className="ld-section-inner-md">
                            <div className="ld-section-head">
                                <div className="ld-section-tag">Process</div>
                                <h2 className="ld-section-title">How It Works</h2>
                            </div>
                            <div className="ld-steps">
                                {howItWorksSteps.map((step, i) => (
                                    <div key={step.title} className="ld-step">
                                        <div className="ld-step-num">0{i + 1}</div>
                                        <div className="ld-step-icon">{step.icon}</div>
                                        <div className="ld-step-body">
                                            <div className="ld-step-title-row">
                                                <span className="ld-step-title">{step.title}</span>
                                                <span className={`ld-tag ${
                                                    step.tag === 'For Clients' ? 'ld-tag-client'
                                                    : step.tag === 'For Freelancers' ? 'ld-tag-freelancer'
                                                    : 'ld-tag-both'
                                                }`}>{step.tag}</span>
                                            </div>
                                            <p className="ld-step-desc">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Categories ── */}
                    <section id="categories" className="ld-section">
                        <div className="ld-section-inner">
                            <div className="ld-section-head">
                                <div className="ld-section-tag">Explore</div>
                                <h2 className="ld-section-title">Top Categories</h2>
                            </div>
                            <div className="ld-cat-grid">
                                {categories.map(cat => (
                                    <div key={cat.name} className="ld-cat-item">
                                        <div className="ld-cat-icon-box">{cat.icon}</div>
                                        <span className="ld-cat-name">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Testimonials ── */}
                    <section className="ld-section ld-section-alt">
                        <div className="ld-section-inner">
                            <div className="ld-section-head">
                                <div className="ld-section-tag">Testimonials</div>
                                <h2 className="ld-section-title">What Our Users Say</h2>
                            </div>
                            <div className="ld-testi-grid">
                                {testimonials.map(t => (
                                    <div key={t.author} className="ld-testi-card">
                                        <div className="ld-testi-stars">
                                            {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                                        </div>
                                        <p className="ld-testi-quote">"{t.quote}"</p>
                                        <div className="ld-testi-author">
                                            <div className="ld-testi-avatar">{t.avatar}</div>
                                            <div>
                                                <div className="ld-testi-name">{t.author}</div>
                                                <div className="ld-testi-role">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── CTA Banner ── */}
                    <section className="ld-cta-section">
                        <div className="ld-cta-box">
                            <div className="ld-cta-glow" />
                            <h2 className="ld-cta-title">Start Building Your Freelance Future Today!</h2>
                            <p className="ld-cta-sub">
                                Join thousands of clients and freelancers who trust NexBid to get real work done.
                            </p>
                            <a href="/signup" className="ld-cta-btn">Join Now — It's Free</a>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Landing;





























































// import React from 'react';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import { Search, ClipboardList, Handshake, Users, Briefcase, Code, PenTool, Edit3, Globe, Database, Video, Star } from 'lucide-react';

// const Landing: React.FC = () => {
//     // Button styles
//     const buttonBase = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//     const buttonLg = "h-12 px-6 text-base";
//     const buttonPrimary = "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500";
//     const buttonSecondary = "bg-teal-100 text-teal-800 hover:bg-teal-200 focus:ring-teal-500";

//     return (
//         <div className="min-h-screen flex flex-col bg-white">
//             <Navbar />

//             <main className="flex-grow">
//                 {/* Hero Section */}
//                 <section className="bg-white py-12 md:py-20 lg:py-24">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                             <div className="space-y-8">
//                                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
//                                     Hire the Right Talent or <br />
//                                     Get Hired — Seamlessly
//                                 </h1>
//                                 <p className="text-lg md:text-xl text-gray-500 max-w-lg">
//                                     A smart marketplace where clients meet skilled freelancers to work, connect, and grow.
//                                 </p>

//                                 <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
//                                     <div className="flex-grow">
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//                                                 <Search className="h-5 w-5" />
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 placeholder="Search for projects or freelancers..."
//                                                 className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 h-12 text-base"
//                                             />
//                                         </div>
//                                     </div>
//                                     <button className={`${buttonBase} ${buttonPrimary} ${buttonLg} h-12 px-8`}>
//                                         Get Started
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="relative h-64 md:h-96 w-full bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl flex items-center justify-center overflow-hidden">
//                                 {/* Placeholder for the illustration - nice gradient background */}
//                                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
//                                 <div className="text-teal-800/20 font-bold text-9xl select-none">NexBid</div>
//                                 {/* Creating a simplistic overlapping card effect for visual interest */}
//                                 <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg transform rotate-3 w-48 hidden md:block">
//                                     <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
//                                     <div className="h-2 w-32 bg-gray-200 rounded mb-4"></div>
//                                     <div className="flex items-center gap-2">
//                                         <div className="h-8 w-8 bg-teal-100 rounded-full"></div>
//                                         <div className="h-2 w-16 bg-gray-200 rounded"></div>
//                                     </div>
//                                 </div>
//                                 <div className="absolute top-8 left-8 bg-white p-4 rounded-xl shadow-lg transform -rotate-3 w-48 hidden md:block">
//                                     <div className="flex justify-between items-center mb-4">
//                                         <div className="h-8 w-8 bg-orange-100 rounded-full"></div>
//                                         <div className="h-4 w-12 bg-green-100 rounded text-xs text-green-700 flex items-center justify-center">Active</div>
//                                     </div>
//                                     <div className="h-2 w-full bg-gray-200 rounded"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* How It Works Section */}
//                 <section id="how-it-works" className="py-16 bg-gray-50">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="text-center mb-16">
//                             <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                             {[
//                                 {
//                                     icon: <ClipboardList className="h-8 w-8 text-teal-600" />,
//                                     title: 'Post a Project',
//                                     description: 'Tell us your project budget and timeline. Get started in minutes.',
//                                 },
//                                 {
//                                     icon: <Handshake className="h-8 w-8 text-teal-600" />,
//                                     title: 'Get Bids',
//                                     description: 'Receive competitive proposals from skilled freelancers worldwide.',
//                                 },
//                                 {
//                                     icon: <Users className="h-8 w-8 text-teal-600" />,
//                                     title: 'Hire & Collaborate',
//                                     description: 'Choose your ideal talent, manage work, and communicate efficiently.',
//                                 },
//                                 {
//                                     icon: <Briefcase className="h-8 w-8 text-teal-600" />,
//                                     title: 'Get Work Done',
//                                     description: 'Approve deliverables, release payment, and achieve your goals.',
//                                 },
//                             ].map((step, index) => (
//                                 <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
//                                     <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
//                                         {step.icon}
//                                     </div>
//                                     <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
//                                     <p className="text-gray-500 leading-relaxed text-sm">
//                                         {step.description}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* Categories Section */}
//                 <section id="categories" className="py-16 bg-white">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="text-center mb-16">
//                             <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {[
//                                 { name: 'Web Development', icon: <Code className="h-6 w-6" /> },
//                                 { name: 'UI/UX Design', icon: <PenTool className="h-6 w-6" /> },
//                                 { name: 'Content Writing', icon: <Edit3 className="h-6 w-6" /> },
//                                 { name: 'Digital Marketing', icon: <Globe className="h-6 w-6" /> },
//                                 { name: 'AI & Data Science', icon: <Database className="h-6 w-6" /> },
//                                 { name: 'Video Editing', icon: <Video className="h-6 w-6" /> },
//                             ].map((category) => (
//                                 <div
//                                     key={category.name}
//                                     className="flex items-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-teal-100 transition-all cursor-pointer group"
//                                 >
//                                     <div className="bg-teal-50 p-3 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors mr-4">
//                                         {category.icon}
//                                     </div>
//                                     <span className="text-lg font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
//                                         {category.name}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* Testimonials Section */}
//                 {/* <section className="py-16 bg-gray-50">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="text-center mb-16">
//                             <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                             {[
//                                 {
//                                     quote: "NexBid helped me find an amazing developer who brought my vision to life quickly and efficiently. The bidding process was straightforward, and collaboration was seamless.",
//                                     author: "Michael Lee",
//                                     role: "Client, Startup Founder",
//                                     rating: 5,
//                                     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
//                                 },
//                                 {
//                                     quote: "As a freelancer, this platform has been a game-changer. I've connected with incredible clients and found projects that truly match my skills. The payment system is secure and reliable.",
//                                     author: "Sarah Kim",
//                                     role: "Freelancer, Graphic Designer",
//                                     rating: 5,
//                                     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
//                                 },
//                                 {
//                                     quote: "Our marketing team needed a content writer with specific industry knowledge, and NexBid delivered. We found a top-tier professional who exceeded our expectations.",
//                                     author: "James Brown",
//                                     role: "Client, Marketing Manager",
//                                     rating: 4,
//                                     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
//                                 }
//                             ].map((testimonial, index) => (
//                                 <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                                     <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>

//                                     <div className="flex items-center">
//                                         <img
//                                             src={testimonial.avatar}
//                                             alt={testimonial.author}
//                                             className="h-12 w-12 rounded-full object-cover mr-4"
//                                         />
//                                         <div>
//                                             <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
//                                             <p className="text-xs text-gray-500">{testimonial.role}</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex mt-4 text-yellow-400">
//                                         {[...Array(5)].map((_, i) => (
//                                             <Star
//                                                 key={i}
//                                                 className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section> */}

//                 {/* CTA Section */}
//                 <section className="py-20 bg-teal-800">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                         <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
//                             Start Building Your Freelance Future Today!
//                         </h2>
//                         <button
//                             className={`${buttonBase} ${buttonSecondary} ${buttonLg} px-8 py-3 bg-white text-teal-800 hover:bg-gray-100 font-bold`}
//                         >
//                             Join Now — It's Free
//                         </button>
//                     </div>
//                 </section>
//             </main>

//             <Footer />
//         </div>
//     );
// };

// export default Landing;













































































