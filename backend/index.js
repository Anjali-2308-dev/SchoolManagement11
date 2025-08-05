import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
// import AddStudentRoute from './routes/AddStudentRoute.js';
// import AddstudentBusRoute from "./routes/AddStudentBusRoute.js"
import AddStaffRoute from './routes/AddStaffRoute.js';   // Import the AddStaffRoute
import AddStockRoute from './routes/AddStockRoute.js'; // Import the AddStockRoute
import AddSubjectRoute  from './routes/AddSubjectRoute.js';
import AddDiaryRoute from './routes/AddDiaryRoute.js'; // Import the AddDiaryRoute
import AddProjectRoute from './routes/AddProjectRoute.js'; // Import the AddProjectRoute
import AddMockTestRoute from './routes/AddmockTestRoute.js'; // Import the AddMockTestRoute
import AddNotificationRoute from './routes/AddNotificationRoute.js'; // Import the AddNotificationRoute
import AddFeedbackRoute from './routes/AddFeedbackRoute.js'; // Import the AddFeedbackRoute
import AddEbookRouter from './routes/AddEbookRouter.js'; // Import the AddEbookRouter
import ebooksRouter from "./routes/AddEbookRouter.js";// Import the upload middleware
import Achievement from "./routes/AddAchievementRoute.js"
import AddGrade from "./routes/AddGradeRoute.js";
import Videos from "./routes/AddVideoRoute.js";
import AddPayroll from "./routes/AddPayrollRoute.js"
import AddFee from "./routes/AddFeeRoute.js"
import AddAttendence from './routes/AddAttendenceRoute.js';  
import Timetable from "./routes/AddTimetableRoute.js"
import AddBus from "./routes/AddbusRoute.js"
import AddStudentBus from "./routes/AddStudentBusRoute.js"
import StudentFeedback from './routes/AddStudentFeedbackRoute.js'




import {Db} from './config/db.js';

const app=express();


app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads/achievements', express.static(path.join(process.cwd(), 'uploads/achievements')));

// Routes







// app.use('/Addstudentbus', AddstudentBusRoute);
app.use("/Addstaff", AddStaffRoute);
app.use("/Addstock", AddStockRoute);
app.use("/subjects", AddSubjectRoute);
app.use("/AddDiary", AddDiaryRoute);
app.use('/AddProject', AddProjectRoute); // Ensure this route is defined
app.use("/AddTest", AddMockTestRoute); // Ensure this route is defined  
app.use("/AddNotification", AddNotificationRoute); // Ensure this route is defined  
app.use("/AddFeedback", AddFeedbackRoute); // Ensure this route is defined
app.use ("/AddEbook", AddEbookRouter); // Ensure this route is defined
app.use('/api/ebooks', ebooksRouter); // for serving files
 // Serve static files from the Ebook directory
app.use('/achievements', Achievement);
app.use('/grades', AddGrade);
app.use('/videos', Videos);
app.use("/payroll", AddPayroll);
app.use("/fee", AddFee);
app.use('/attendance', AddAttendence);
// app.use('/addstudentattendance',AddStudentAttendance) // Ensure this route is defined
app.use('/timetable', Timetable); // Ensure this route is defined
app.use("/addbus",AddBus)
app.use('/addstudentbus',AddStudentBus)
app.use('/studentfeedback',StudentFeedback)



Db.on('error', (err) => console.error('MongoDB error:', err));



    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    })
