// app/hr/recruitment/components/ResumeUpload.js
import { useState } from 'react';

const ResumeUpload = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
        id="resume-upload"
      />
      <label
        htmlFor="resume-upload"
        className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded inline-block"
      >
        {fileName || 'Select Resume'}
      </label>
      {fileName && (
        <span className="ml-2 text-sm text-gray-600">{fileName}</span>
      )}
    </div>
  );
};

export default ResumeUpload;
// ******************************



// // app/hr/recruitment/components/ResumeUpload.js
// import { useState } from 'react';
// import axios from 'axios';

// const ResumeUpload = ({ onUploadComplete }) => {
//   const [file, setFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return;
    
//     setIsUploading(true);
//     const formData = new FormData();
//     formData.append('resume', file);

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hr/recruitment/parse-resume`, formData, {
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percentCompleted);
//         }
//       });
//       onUploadComplete(response.data);
//     } catch (error) {
//       console.error('Error uploading resume:', error);
//     } finally {
//       setIsUploading(false);
//       setProgress(0);
//     }
//   };

//   return (
//     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={handleFileChange}
//         className="hidden"
//         id="resume-upload"
//       />
//       <label
//         htmlFor="resume-upload"
//         className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded"
//       >
//         {file ? file.name : 'Select Resume'}
//       </label>
      
//       {file && (
//         <div className="mt-4">
//           <button
//             onClick={handleUpload}
//             disabled={isUploading}
//             className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400"
//           >
//             {isUploading ? `Uploading... ${progress}%` : 'Upload & Parse'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeUpload;