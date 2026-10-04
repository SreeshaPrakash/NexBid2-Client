import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.errorCode}>404</h1>
                <div style={styles.divider}></div>
                <h2 style={styles.title}>Oops! Page Not Found</h2>
                <p style={styles.message}>
                    The page you're looking for doesn't exist or has been moved.
                    Don't worry, you can always head back to safety.
                </p>
                <Link to="/" style={styles.button}>
                    Back to Home
                </Link>
            </div>
            
            {/* Background decorative elements */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        textAlign: 'center',
        zIndex: 10,
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '480px',
        width: '90%',
    },
    errorCode: {
        fontSize: '8rem',
        fontWeight: 900,
        margin: 0,
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
    },
    divider: {
        height: '4px',
        width: '60px',
        backgroundColor: '#2563eb',
        margin: '1.5rem auto',
        borderRadius: '2px',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.125rem',
        color: '#64748b',
        lineHeight: 1.6,
        marginBottom: '2rem',
    },
    button: {
        display: 'inline-block',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '0.75rem 2rem',
        borderRadius: '0.75rem',
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    },
    blob1: {
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        zIndex: 1,
    },
    blob2: {
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        zIndex: 1,
    }
};

export default NotFound;
