// // app/error.js
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Error({ error, reset }) {
//   const router = useRouter();

//   useEffect(() => {
//     // Check if this is a static export 404
//     if (typeof window !== 'undefined' && 
//        (error.message.includes('404') || error.message.includes('Failed to load static page'))) {
//       const path = window.location.pathname;
      
//       // Avoid infinite loops
//       if (path !== '/' && !path.startsWith('/_next')) {
//         // First try client-side navigation
//         router.replace(path);
        
//         // Fallback after 2 seconds if still failing
//         const timer = setTimeout(() => {
//           window.location.href = path; // Full page reload as last resort
//         }, 2000);
        
//         return () => clearTimeout(timer);
//       }
//     }
//   }, [error, router]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center p-4 max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Loading application...</h2>
//         <div className="animate-pulse flex justify-center mb-4">
//           <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
//         </div>
//         <button 
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           Click here if loading takes too long
//         </button>
//       </div>
//     </div>
//   );
// }