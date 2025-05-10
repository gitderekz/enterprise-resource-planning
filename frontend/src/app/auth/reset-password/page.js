'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import ResetPasswordForm from './ResetPasswordForm'

const ResetPasswordPage = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const token = searchParams.get('token');
  // const [formData, setFormData] = useState({
  //   password: '',
  //   confirmPassword: ''
  // });
  // const [loading, setLoading] = useState(false);
  // const [validToken, setValidToken] = useState(false);
  // const [checkingToken, setCheckingToken] = useState(true);

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-token`, {
  //         params: { token }
  //       });
  //       setValidToken(true);
  //     } catch (error) {
  //       toast.error('Invalid or expired reset token');
  //       router.push('/forgot-password');
  //     } finally {
  //       setCheckingToken(false);
  //     }
  //   };

  //   if (token) {
  //     verifyToken();
  //   } else {
  //     toast.error('No reset token provided');
  //     router.push('/forgot-password');
  //   }
  // }, [token, router]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (formData.password !== formData.confirmPassword) {
  //     toast.error('Passwords do not match');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
  //       token,
  //       newPassword: formData.password
  //     });
  //     toast.success('Password reset successfully!');
  //     router.push('/login');
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to reset password');
  //     console.error('Reset password error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (checkingToken) {
  //   return (
  //     <div style={styles.container}>
  //       <div style={styles.logo}>enrep.sys</div>
  //       <div style={styles.form}>
  //         <p style={styles.loadingText}>Verifying reset token...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!validToken) {
  //   return null; // Already handled in useEffect
  // }

  return (
    <Suspense>
      <ResetPasswordForm/>
    </Suspense>
  );
};

export default ResetPasswordPage;



// 'use client';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Link from 'next/link';

// const ResetPasswordPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');
//   const [formData, setFormData] = useState({
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [validToken, setValidToken] = useState(false);
//   const [checkingToken, setCheckingToken] = useState(true);

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-token`, {
//           params: { token }
//         });
//         setValidToken(true);
//       } catch (error) {
//         toast.error('Invalid or expired reset token');
//         router.push('/forgot-password');
//       } finally {
//         setCheckingToken(false);
//       }
//     };

//     if (token) {
//       verifyToken();
//     } else {
//       toast.error('No reset token provided');
//       router.push('/forgot-password');
//     }
//   }, [token, router]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
//         token,
//         newPassword: formData.password
//       });
//       toast.success('Password reset successfully!');
//       router.push('/login');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to reset password');
//       console.error('Reset password error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (checkingToken) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.logo}>enrep.sys</div>
//         <div style={styles.form}>
//           <p style={styles.loadingText}>Verifying reset token...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!validToken) {
//     return null; // Already handled in useEffect
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.logo}>enrep.sys</div>
//       <form style={styles.form} onSubmit={handleSubmit}>
//         <h2 style={styles.title}>Reset Password</h2>
//         <div style={styles.inputGroup}>
//           <label htmlFor="password" style={styles.label}>New Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="New password"
//             value={formData.password}
//             onChange={handleChange}
//             style={styles.input}
//             required
//             minLength="6"
//           />
//         </div>
//         <div style={styles.inputGroup}>
//           <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             name="confirmPassword"
//             placeholder="Confirm new password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             style={styles.input}
//             required
//           />
//         </div>
//         <button 
//           type="submit" 
//           style={styles.button} 
//           disabled={loading}
//         >
//           {loading ? 'Resetting...' : 'Reset Password'}
//         </button>
//         <div style={styles.loginLink}>
//           Remember your password? <Link href="/login" style={styles.link}>Login</Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#461B93',
//   },
//   logo: {
//     fontSize: '32px',
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: '20px',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '400px',
//     padding: '24px',
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//   },
//   title: {
//     fontSize: '20px',
//     fontWeight: '600',
//     color: '#461B93',
//     marginBottom: '20px',
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: '16px',
//     textAlign: 'left',
//   },
//   label: {
//     fontSize: '14px',
//     color: '#461B93',
//     marginBottom: '8px',
//     display: 'block',
//   },
//   input: {
//     width: '100%',
//     padding: '12px',
//     borderRadius: '8px',
//     border: '1px solid #6A3CBC',
//     fontSize: '14px',
//     color: '#2d3436',
//     outline: 'none',
//     backgroundColor: '#ffffff',
//   },
//   button: {
//     padding: '12px',
//     borderRadius: '8px',
//     backgroundColor: '#461B93',
//     color: '#ffffff',
//     border: 'none',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     marginTop: '16px',
//   },
//   loginLink: {
//     textAlign: 'center',
//     marginTop: '16px',
//     fontSize: '14px',
//     color: '#2d3436',
//   },
//   link: {
//     color: '#461B93',
//     fontWeight: '500',
//     textDecoration: 'none',
//   },
//   loadingText: {
//     textAlign: 'center',
//     color: '#2d3436',
//   },
// };

// export default ResetPasswordPage;