'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        username: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>enrep.sys</div>
      <form style={styles.form} onSubmit={handleRegister}>
        <h2 style={styles.title}>Create Account</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
            minLength="6"
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button 
          type="submit" 
          style={styles.button} 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div style={styles.loginLink}>
          Already have an account? <Link href="/login" style={styles.link}>Login</Link>
        </div>
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
};

export default RegisterPage;