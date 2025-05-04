'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>enrep.sys</div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Forgot Password</h2>
        {emailSent ? (
          <div style={styles.successMessage}>
            <p>We've sent a password reset link to your email address.</p>
            <p>Please check your inbox and follow the instructions.</p>
            <button 
              type="button" 
              style={styles.button}
              onClick={() => router.push('/login')}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button 
              type="submit" 
              style={styles.button} 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={styles.loginLink}>
              Remember your password? <Link href="/login" style={styles.link}>Login</Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#461B93',
  },
  logo: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#461B93',
    marginBottom: '20px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '16px',
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    color: '#461B93',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #6A3CBC',
    fontSize: '14px',
    color: '#2d3436',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#461B93',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '16px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#2d3436',
  },
  link: {
    color: '#461B93',
    fontWeight: '500',
    textDecoration: 'none',
  },
  successMessage: {
    textAlign: 'center',
    color: '#2d3436',
    marginBottom: '16px',
  },
};

export default ForgotPasswordPage;