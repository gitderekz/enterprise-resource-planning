// 'use client'; // Mark as a Client Component
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function Login() {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });
//       toast.success('Login successful!');
//       localStorage.setItem('token', response.data.token);
//       router.push('/dashboard');
//     } catch (error) {
//       toast.error('Login failed!');
//       console.error('Login failed:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-6">{t('login')}</h1>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">{t('username')}</label>
//             <input
//               type="text"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-2">{t('password')}</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//             {t('login')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../lib/authSlice'; // Make sure the path is correct

const LoginPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      
      const token = response.data.token;
      const user = response.data.user;

      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch login action to Redux
      dispatch(login({ token, user }));

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Login failed!');
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>enrep.sys</div>
      <form style={styles.form} onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            placeholder="Insert username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            placeholder="Insert password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>{t('login')}</button>
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
    backgroundColor: '#461B93', // Dark purple background
  },
  logo: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#ffffff', // White logo
    marginBottom: '40px', // Space between logo and form
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px', // Increased width
    padding: '24px',
    // backgroundColor: '#ffffff', // White form background
    borderRadius: '12px',
    // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '20px', // Increased spacing
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    color: '#461B93', // Purple label
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #6A3CBC', // Purple border
    fontSize: '14px',
    color: '#2d3436', // Dark gray text
    outline: 'none',
    backgroundColor: '#ffffff', // White background
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#ffffff', // White button
    color: '#461B93', // Purple text
    border: '1px solid #6A3CBC', // Purple border
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '16px',
  },
};

export default LoginPage;