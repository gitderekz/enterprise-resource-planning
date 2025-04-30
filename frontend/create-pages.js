const fs = require('fs');
const path = require('path');

// ✅ This path now works from *inside* the frontend folder
const baseDir = path.join(__dirname, 'src', 'app');

const menuNames = [
  'Recruitment', 'Onboarding', 'Payroll', 'Timetable', 'Attendance',
  'Performance', 'Administration', 'Assessment', 'cis', 'Invoices',
  'Cash-insights', 'Income', 'Expenses', 'Reports', 'Receipts'
];

// Utility to format valid folder names
function toFolderName(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

menuNames.forEach(name => {
  const folderName = toFolderName(name);
  const folderPath = path.join(baseDir, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 Created folder: ${folderPath}`);
  }

  const pagePath = path.join(folderPath, 'page.js');
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, `export default function ${folderName.replace(/-./g, m => m[1].toUpperCase())}Page() {
  return <div>${name} Page</div>;
}
`);
    console.log(`📝 Created page: ${pagePath}`);
  } else {
    console.log(`⚠️  Skipped existing: ${pagePath}`);
  }
});
