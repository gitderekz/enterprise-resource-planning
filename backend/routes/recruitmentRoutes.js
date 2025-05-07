// // routes/recruitmentRoutes.js
// const express = require('express');
// const router = express.Router();
// const db = require('../models');
// const { Op } = require('sequelize');
// const multer = require('multer');
// const path = require('path');

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Make sure this directory exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });


// // Get recruitment stats
// router.get('/stats', async (req, res) => {
//   try {
//     const stats = {
//       openPositions: await db.JobRequisition.count({ where: { status: 'Approved' } }),
//       candidates: await db.Candidate.count(),
//       interviews: await db.Interview.count(),
//       hires: await db.Candidate.count({ where: { status: 'Hired' } })
//     };
//     res.json(stats);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching stats' });
//   }
// });

// // Job Requisitions
// router.get('/requisitions', async (req, res) => {
//   try {
//     const requisitions = await db.JobRequisition.findAll();
//     res.json(requisitions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching requisitions' });
//   }
// });

// // router.post('/requisitions', async (req, res) => {
// //   try {
// //     const requisition = await db.JobRequisition.create(req.body);
// //     res.status(201).json(requisition);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error creating requisition' });
// //   }
// // });
// router.post('/requisitions', async (req, res) => {
//     try {
//       const requisition = await db.JobRequisition.create(req.body);
      
//       // Post to job boards if approved
//       if (req.body.status === 'Approved') {
//         const jobData = {
//           jobtitle: req.body.position,
//           company: 'Your Company Name',
//           formattedLocation: 'Remote',
//           description: req.body.jobDescription,
//           requirements: req.body.requirements
//         };
        
//         // await postToJobBoards(jobData);
//       }
  
//       res.status(201).json(requisition);
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating requisition' });
//     }
//   });

// // Candidates
// router.post('/candidates', upload.single('resume'), async (req, res) => {
//     try {
//       let candidateData = req.body;
      
//       if (req.file) {
//         const parsedData = await parseResume(req.file.path);
//         candidateData = {
//           ...candidateData,
//           ...parsedData,
//           resumeUrl: `/uploads/${req.file.filename}`
//         };
//       }
  
//       const candidate = await db.Candidate.create(candidateData);
//       res.status(201).json(candidate);
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating candidate' });
//     }
//   });
// router.get('/candidates', async (req, res) => {
//   try {
//     const candidates = await db.Candidate.findAll({
//       order: [['applicationDate', 'DESC']]
//     });
//     res.json(candidates);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching candidates' });
//   }
// });

// router.put('/candidates/:id', async (req, res) => {
//   try {
//     const candidate = await db.Candidate.findByPk(req.params.id);
//     if (!candidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
//     await candidate.update(req.body);
//     res.json(candidate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating candidate' });
//   }
// });

// // Add to your recruitmentRoutes.js
// router.get('/interviews', async (req, res) => {
//   try {
//     const interviews = await db.Interview.findAll({
//       order: [['interviewDate', 'ASC']],
//       include: [{
//         model: db.Candidate,
//         attributes: ['name', 'positionApplied']
//       }]
//     });
//     res.json(interviews);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching interviews' });
//   }
// });

// //   router.post('/interviews', async (req, res) => {
// //     try {
// //       const interview = await db.Interview.create(req.body);
// //       res.status(201).json(interview);
// //     } catch (error) {
// //       res.status(500).json({ message: 'Error creating interview' });
// //     }
// //   });

// router.post('/interviews', async (req, res) => {
//   try {
//     const interview = await db.Interview.create(req.body);
    
//     // Create calendar event
//     const candidate = await db.Candidate.findByPk(req.body.candidateId);
//     const event = {
//       summary: `Interview: ${candidate.name} - ${candidate.positionApplied}`,
//       description: req.body.notes,
//       start: {
//         dateTime: req.body.interviewDate,
//         timeZone: 'UTC',
//       },
//       end: {
//         dateTime: new Date(new Date(req.body.interviewDate).getTime() + 60*60*1000).toISOString(),
//         timeZone: 'UTC',
//       },
//       attendees: [
//         { email: req.body.interviewerEmail }, // Add interviewer email to form
//         { email: candidate.email }
//       ],
//       reminders: {
//         useDefault: false,
//         overrides: [
//           { method: 'email', minutes: 24 * 60 },
//           { method: 'popup', minutes: 30 },
//         ],
//       },
//     };

//     // You'll need to implement OAuth2 for this
//     // const calendarEvent = await createCalendarEvent(authClient, event);
//     // interview.calendarEventId = calendarEvent.id;
//     // await interview.save();

//     res.status(201).json(interview);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating interview' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { sequelize } = db;
const multer = require('multer');
const path = require('path');
const { generateOfferLetter } = require('../services/offerService');
const fs = require('fs');

// // Configure file uploads
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// Configure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadPath = path.join(__dirname, '../uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Error class for specific recruitment errors
class RecruitmentError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// === Helper Functions ===
const handleError = (res, error, defaultMessage = 'An error occurred') => {
  if (error instanceof RecruitmentError) {
    return res.status(error.statusCode).json({ 
      message: error.message 
    });
  }
  
  console.error(error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: error.errors.map(e => e.message) 
    });
  }
  
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ 
      message: error.message 
    });
  }
  
  res.status(500).json({ 
    message: defaultMessage 
  });
};

// === Recruitment Stats ===
router.get('/stats', async (req, res) => {
  try {
    const [openPositions, candidates, interviews, hires] = await Promise.all([
      db.JobRequisition.count({ where: { status: 'Open' } }),
      db.Candidate.count(),
      db.Interview.count(),
      db.Candidate.count({ where: { status: 'Hired' } })
    ]);
    res.json({ openPositions, candidates, interviews, hires });
  } catch (error) {
    handleError(res, error, 'Failed to load stats');
  }
});

// === Job Requisitions ===
router.get('/requisitions', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    
    const requisitions = await db.JobRequisition.findAll({ 
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(requisitions);
  } catch (error) {
    handleError(res, error, 'Failed to fetch jobs');
  }
  // try {
  //   const requisitions = await db.JobRequisition.findAll({
  //     order: [['createdAt', 'DESC']]
  //   });
  //   res.json(requisitions);
  // } catch (error) {
  //   handleError(res, error, 'Failed to fetch jobs');
  // }
});

router.get('/requisitions/:id', async (req, res) => {
  try {
    const requisition = await db.JobRequisition.findByPk(req.params.id, {
      include: [{
        model: db.Candidate,
        as: 'candidates'
      }]
    });
    if (!requisition) return res.status(404).json({ message: 'Requisition not found' });
    res.json(requisition);
  } catch (error) {
    handleError(res, error, 'Failed to fetch requisition');
  }
});

router.post('/requisitions', async (req, res) => {
  try {
    const requisition = await db.JobRequisition.create(req.body);
    res.status(201).json(requisition);
  } catch (error) {
    handleError(res, error, 'Failed to create job');
  }
});

router.put('/requisitions/:id', async (req, res) => {
  try {
    const requisition = await db.JobRequisition.findByPk(req.params.id);
    if (!requisition) return res.status(404).json({ message: 'Job not found' });
    await requisition.update(req.body);
    res.json(requisition);
  } catch (error) {
    handleError(res, error, 'Failed to update job');
  }
});

// === Candidates ===
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await db.Candidate.findAll({
      include: [{
        model: db.JobRequisition,
        as: 'jobRequisition', // Add this
        attributes: ['title']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(candidates);
  } catch (error) {
    handleError(res, error, 'Failed to fetch candidates');
  }
});
// router.get('/candidates', async (req, res) => {
//   try {
//     const where = {};
//     if (req.query.search) {
//       where[Op.or] = [
//         { name: { [Op.like]: `%${req.query.search}%` } },
//         { positionApplied: { [Op.like]: `%${req.query.search}%` } },
//         { skills: { [Op.like]: `%${req.query.search}%` } }
//       ];
//     }

//     const candidates = await db.Candidate.findAll({
//       where,
//       include: [{
//         model: db.JobRequisition,
//         as: 'jobRequisition',
//         attributes: ['position', 'department']
//       }],
//       order: [['applicationDate', 'DESC']]
//     });
//     res.json(candidates);
//   } catch (error) {
//     handleError(res, error, 'Failed to fetch candidates');
//   }
// });

router.post('/candidates', upload.single('resume'), async (req, res) => {
  try {
    const candidateData = {
      ...req.body,
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : null
    };
    const candidate = await db.Candidate.create(candidateData);
    res.status(201).json(candidate);
  } catch (error) {
    handleError(res, error, 'Failed to create candidate');
  }

  // try {
  //   let candidateData = req.body;
    
  //   if (req.file) {
  //     const { text } = await parseResume(req.file.path);
  //     candidateData = {
  //       ...candidateData,
  //       resumeText: text,
  //       resumeUrl: `/uploads/${req.file.filename}`
  //     };
  //   }

  //   const candidate = await db.Candidate.create(candidateData);
  //   res.status(201).json(candidate);
  // } catch (error) {
  //   handleError(res, error, 'Failed to create candidate');
  // }
});

router.put('/candidates/:id', async (req, res) => {
  try {
    const candidate = await db.Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    await candidate.update(req.body);
    res.json(candidate);
  } catch (error) {
    handleError(res, error, 'Failed to update candidate');
  }
});

// === Interviews ===
router.get('/interviews', async (req, res) => {
  try {
    const interviews = await db.Interview.findAll({
      include: [
        { 
          model: db.Candidate, 
          as: 'candidate', // Add this
          attributes: ['name', 'email', 'positionApplied', 'applicationDate',  ] 
        },
        { 
          model: db.JobRequisition, 
          as: 'jobRequisition', // Add this
          attributes: ['title'] 
        }
      ],
      order: [['interviewDate', 'ASC']]
    });
    res.json(interviews);
  } catch (error) {
    handleError(res, error, 'Failed to fetch interviews');
  }
});

// router.post('/interviews', async (req, res) => {
//   try {
//     const interview = await db.Interview.create(req.body);
    
//     // In a real app, you would add calendar integration here
//     // await calendarService.scheduleInterview(interview);
    
//     res.status(201).json(interview);
//   } catch (error) {
//     handleError(res, error, 'Failed to schedule interview');
//   }
// });
router.post('/interviews', async (req, res) => {
  try {
    // Validate required fields
    const { candidateId, interviewer, interviewDate, interviewType, jobRequisitionId } = req.body;
    if (!candidateId || !interviewer || !interviewDate || !jobRequisitionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if candidate exists
    const candidate = await db.Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check if job requisition exists
    const job = await db.JobRequisition.findByPk(jobRequisitionId);
    if (!job) {
      return res.status(404).json({ message: 'Job requisition not found' });
    }

    // Create interview
    const interview = await db.Interview.create({
      candidateId,
      interviewer,
      interviewDate: new Date(interviewDate),
      jobRequisitionId,
      interviewType,
      status: 'Scheduled'
    });

    // Update candidate status
    await candidate.update({ status: 'Interview' });

    // In production: Add calendar integration here
    // await calendarService.scheduleInterview(interview, candidate, job);

    res.status(201).json({
      message: 'Interview scheduled successfully',
      interview,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        newStatus: candidate.status
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to schedule interview');
  }
});

router.put('/interviews/:id/status', async (req, res) => {
  try {
    const interview = await db.Interview.findByPk(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    
    await interview.update({ 
      status: req.body.status,
      feedback: req.body.feedback || null
    });
    
    // Update candidate status if hired
    if (req.body.status === 'Completed' && req.body.hired) {
      await db.Candidate.update(
        { status: 'Hired' },
        { where: { id: interview.candidateId } }
      );
    }
    
    res.json(interview);
  } catch (error) {
    handleError(res, error, 'Failed to update interview');
  }
});

router.put('/interviews/:id', async (req, res) => {
  try {
    const interview = await db.Interview.findByPk(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    await interview.update(req.body);
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating interview' });
  }
});

// Generate offer from interview
router.post('/interviews/:id/offer', async (req, res) => {
  try {
    const interview = await db.Interview.findByPk(req.params.id, {
      include: [{model: db.Candidate, as: 'candidate'}, {model: db.JobRequisition, as: 'jobRequisition'}]
    });
    
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    
    const offer = await db.Offer.create({
      candidateId: interview.candidateId,
      jobRequisitionId: interview.jobRequisitionId,
      status: 'Pending',
      ...req.body
    });
    
    await interview.update({ status: 'Offer' });
    await interview.candidate.update({ status: 'Offer' });
    
    res.status(201).json(offer);
  } catch (error) {
    handleError(res, error, 'Failed to generate offer');
  }
});

// === Offers ===
router.get('/offers', async (req, res) => {
  try {
    const offers = await db.Interview.findAll({
      where: { status: 'Offer' },
      include: [
        { model: db.Candidate, as: 'candidate', attributes: ['name', 'email', 'phone'] },
        { model: db.JobRequisition, as: 'jobRequisition', attributes: ['title', 'salaryRange'] }
      ]
    });
    res.json(offers);
  } catch (error) {
    handleError(res, error, 'Failed to fetch offers');
  }
});

router.post('/offers/:interviewId', async (req, res) => {
  try {
    const interview = await db.Interview.findByPk(req.params.interviewId, {
      include: [
        { model: db.Candidate, as: 'candidate' },
        { model: db.JobRequisition, as: 'jobRequisition' }
      ]
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Validate interview is completed
    if (interview.status !== 'Completed') {
      return res.status(400).json({ message: 'Only completed interviews can generate offers' });
    }

    // Update interview status
    await interview.update({ status: 'Offer' });

    // Update candidate status
    await interview.candidate.update({ status: 'Offer' });

    // Before offer generation
    if (!['Completed', 'Offer'].includes(interview.status)) {
      return res.status(400).json({ 
        message: 'Only completed interviews can generate offers' 
      });
    }
    
    // Generate offer letter (PDF)
    const offerData = {
      candidateName: interview.candidate.name,
      position: interview.jobRequisition.position,
      salary: req.body.salary || interview.jobRequisition.salaryRange,
      startDate: req.body.startDate,
      terms: req.body.terms || 'Standard company terms apply'
    };

    const offerLetter = await generateOfferLetter(offerData);

    // Save offer details (in production, you might save to database)
    const offer = {
      interviewId: interview.id,
      candidateId: interview.candidateId,
      jobRequisitionId: interview.jobRequisitionId,
      offerLetterUrl: `/offers/${offerLetter.filename}`,
      status: 'Pending',
      ...offerData
    };

    res.json({
      message: 'Offer generated successfully',
      offer,
      downloadUrl: `/api/hr/recruitment/offers/${offerLetter.filename}/download`
    });
  } catch (error) {
    handleError(res, error, 'Failed to generate offer');
  }
});

// Update offer
router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await db.Offer.findByPk(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    
    await offer.update(req.body);
    
    if (req.body.status === 'Accepted') {
      await db.Candidate.update(
        { status: 'Hired' },
        { where: { id: offer.candidateId } }
      );
    }
    
    res.json(offer);
  } catch (error) {
    handleError(res, error, 'Failed to update offer');
  }
});

// Add this for offer download
router.get('/offers/:filename/download', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/offer-letters', req.params.filename);
    res.download(filePath);
  } catch (error) {
    handleError(res, error, 'Failed to download offer letter');
  }
});

router.get('/reports', async (req, res) => {
  try {
    const [pipeline, timeToHire] = await Promise.all([
      db.Candidate.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      }),
      db.sequelize.query(`
        SELECT 
          j.position AS role,
          AVG(DATEDIFF(i.interviewDate, c.applicationDate)) AS days
        FROM Candidates c
        JOIN Interviews i ON c.id = i.candidateId
        JOIN JobRequisitions j ON i.jobRequisitionId = j.id
        WHERE c.status = 'Hired'
        GROUP BY j.position
      `, { type: sequelize.QueryTypes.SELECT })
    ]);

    res.json({
      pipeline,
      timeToHire
    });
  } catch (error) {
    handleError(res, error, 'Failed to generate reports');
  }
});

module.exports = router;