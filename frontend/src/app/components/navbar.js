// 'use client'; // Mark as a Client Component
// import { useContext } from 'react';
import { ThemeContext } from '../lib/ThemeContext';

// export default function Navbar() {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   return (
//     <nav
//       className={`p-4 fixed top-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
//     >
//       <div className="flex justify-between items-center">
//         <span className="text-xl">Light/Dark</span>
//         <button onClick={toggleTheme} className="text-xl">
//           {theme === 'light' ? '🌙' : '☀️'}
//         </button>
//       </div>
//     </nav>
//   );
// }
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { logout } from '../lib/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication state from Redux
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className={`p-4 fixed top-0 right-0 z-50 bg-gray-800 text-white ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      {isAuthenticated ? (
        <button onClick={handleLogout} className="bg-red-500 p-2 rounded">
          Logout
        </button>
      ) : (
        <button onClick={() => router.push('/login')} className="bg-blue-500 p-2 rounded">
          Login
        </button>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xl">Light/Dark</span>
        <button onClick={toggleTheme} className="text-xl">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
