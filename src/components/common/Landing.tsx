import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Search, ClipboardList, Handshake, Users, Briefcase, Code, PenTool, Edit3, Globe, Database, Video, Star } from 'lucide-react';

const Landing: React.FC = () => {
    // Button styles
    const buttonBase = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const buttonLg = "h-12 px-6 text-base";
    const buttonPrimary = "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500";
    const buttonSecondary = "bg-teal-100 text-teal-800 hover:bg-teal-200 focus:ring-teal-500";

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white py-12 md:py-20 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                    Hire the Right Talent or <br />
                                    Get Hired — Seamlessly
                                </h1>
                                <p className="text-lg md:text-xl text-gray-500 max-w-lg">
                                    A smart marketplace where clients meet skilled freelancers to work, connect, and grow.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                                    <div className="flex-grow">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <Search className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search for projects or freelancers..."
                                                className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 h-12 text-base"
                                            />
                                        </div>
                                    </div>
                                    <button className={`${buttonBase} ${buttonPrimary} ${buttonLg} h-12 px-8`}>
                                        Get Started
                                    </button>
                                </div>
                            </div>

                            <div className="relative h-64 md:h-96 w-full bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                {/* Placeholder for the illustration - nice gradient background */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                <div className="text-teal-800/20 font-bold text-9xl select-none">NexBid</div>
                                {/* Creating a simplistic overlapping card effect for visual interest */}
                                <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg transform rotate-3 w-48 hidden md:block">
                                    <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-2 w-32 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-teal-100 rounded-full"></div>
                                        <div className="h-2 w-16 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="absolute top-8 left-8 bg-white p-4 rounded-xl shadow-lg transform -rotate-3 w-48 hidden md:block">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="h-8 w-8 bg-orange-100 rounded-full"></div>
                                        <div className="h-4 w-12 bg-green-100 rounded text-xs text-green-700 flex items-center justify-center">Active</div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <ClipboardList className="h-8 w-8 text-teal-600" />,
                                    title: 'Post a Project',
                                    description: 'Tell us your project budget and timeline. Get started in minutes.',
                                },
                                {
                                    icon: <Handshake className="h-8 w-8 text-teal-600" />,
                                    title: 'Get Bids',
                                    description: 'Receive competitive proposals from skilled freelancers worldwide.',
                                },
                                {
                                    icon: <Users className="h-8 w-8 text-teal-600" />,
                                    title: 'Hire & Collaborate',
                                    description: 'Choose your ideal talent, manage work, and communicate efficiently.',
                                },
                                {
                                    icon: <Briefcase className="h-8 w-8 text-teal-600" />,
                                    title: 'Get Work Done',
                                    description: 'Approve deliverables, release payment, and achieve your goals.',
                                },
                            ].map((step, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                                    <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Web Development', icon: <Code className="h-6 w-6" /> },
                                { name: 'UI/UX Design', icon: <PenTool className="h-6 w-6" /> },
                                { name: 'Content Writing', icon: <Edit3 className="h-6 w-6" /> },
                                { name: 'Digital Marketing', icon: <Globe className="h-6 w-6" /> },
                                { name: 'AI & Data Science', icon: <Database className="h-6 w-6" /> },
                                { name: 'Video Editing', icon: <Video className="h-6 w-6" /> },
                            ].map((category) => (
                                <div
                                    key={category.name}
                                    className="flex items-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-teal-100 transition-all cursor-pointer group"
                                >
                                    <div className="bg-teal-50 p-3 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors mr-4">
                                        {category.icon}
                                    </div>
                                    <span className="text-lg font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                                        {category.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                {/* <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "NexBid helped me find an amazing developer who brought my vision to life quickly and efficiently. The bidding process was straightforward, and collaboration was seamless.",
                                    author: "Michael Lee",
                                    role: "Client, Startup Founder",
                                    rating: 5,
                                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                },
                                {
                                    quote: "As a freelancer, this platform has been a game-changer. I've connected with incredible clients and found projects that truly match my skills. The payment system is secure and reliable.",
                                    author: "Sarah Kim",
                                    role: "Freelancer, Graphic Designer",
                                    rating: 5,
                                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                },
                                {
                                    quote: "Our marketing team needed a content writer with specific industry knowledge, and NexBid delivered. We found a top-tier professional who exceeded our expectations.",
                                    author: "James Brown",
                                    role: "Client, Marketing Manager",
                                    rating: 4,
                                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>

                                    <div className="flex items-center">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            className="h-12 w-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                                            <p className="text-xs text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex mt-4 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* CTA Section */}
                <section className="py-20 bg-teal-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            Start Building Your Freelance Future Today!
                        </h2>
                        <button
                            className={`${buttonBase} ${buttonSecondary} ${buttonLg} px-8 py-3 bg-white text-teal-800 hover:bg-gray-100 font-bold`}
                        >
                            Join Now — It's Free
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;
