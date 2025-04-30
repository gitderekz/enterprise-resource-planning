@echo off

rem Ensure the root directories exist
if not exist "frontend\src\app" (
    echo Creating directory structure...
    mkdir "frontend\src\app"
)

rem Create the folder structure for all the pages under frontend/src/app
for %%d in (
    "recruitment"
    "onboarding"
    "payroll"
    "timetable"
    "attendance"
    "performance"
    "administration"
    "assessment"
    "cis"
    "invoices"
    "cash-insights"
    "income"
    "expenses"
    "reports"
    "receipts"
) do (
    if not exist "frontend\src\app\%%d" (
        mkdir "frontend\src\app\%%d"
    )
    echo import React, { useContext } from 'react'; > "frontend\src\app\%%d\page.js"
    echo const %%d = () => { >> "frontend\src\app\%%d\page.js"
    echo return ( >> "frontend\src\app\%%d\page.js"
    echo <div> >> "frontend\src\app\%%d\page.js"
    echo <h1>%%d Page</h1> >> "frontend\src\app\%%d\page.js"
    echo <p>This is an empty placeholder page for the %%d section.</p> >> "frontend\src\app\%%d\page.js"
    echo </div>; >> "frontend\src\app\%%d\page.js"
    echo }; >> "frontend\src\app\%%d\page.js"
    echo export default %%d; >> "frontend\src\app\%%d\page.js"
)

rem Create the home page inside frontend/src/app
if not exist "frontend\src\app\page.js" (
    echo import React, { useContext } from 'react'; > "frontend\src\app\page.js"
    echo const Home = () => { >> "frontend\src\app\page.js"
    echo return ( >> "frontend\src\app\page.js"
    echo <div> >> "frontend\src\app\page.js"
    echo <h1>Home Page</h1> >> "frontend\src\app\page.js"
    echo <p>Welcome to the Home Page</p> >> "frontend\src\app\page.js"
    echo </div>; >> "frontend\src\app\page.js"
    echo }; >> "frontend\src\app\page.js"
    echo export default Home; >> "frontend\src\app\page.js"
)

echo Directories and files created successfully!
pause
