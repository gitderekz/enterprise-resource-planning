const db = require('../models');
const { Op } = require('sequelize');

// Get all performance reviews
const getPerformanceReviews = async (req, res) => {
  try {
    const reviews = await db.performanceReview.findAll({
      include: [
        { model: db.user, as: 'employee' },
        { model: db.user, as: 'reviewer' }
      ],
      order: [['reviewDate', 'DESC']]
    });

    // Get last review dates for each employee
    const lastReviews = await db.performanceReview.findAll({
      attributes: [
        'employeeId',
        [db.sequelize.fn('MAX', db.sequelize.col('reviewDate')), 'lastReviewDate']
      ],
      group: ['employeeId'],
      raw: true
    });

    const lastReviewMap = lastReviews.reduce((acc, curr) => {
      acc[curr.employeeId] = curr.lastReviewDate;
      return acc;
    }, {});

    const enrichedReviews = reviews.map(review => ({
      ...review.get({ plain: true }),
      lastReviewDate: lastReviewMap[review.employeeId]
    }));

    res.json(enrichedReviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching performance reviews', error: err.message });
  }
};

// Get performance review by ID
const getPerformanceReviewById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const review = await db.performanceReview.findByPk(id, {
      include: [
        { model: db.user, as: 'employee' },
        { model: db.user, as: 'reviewer' }
      ]
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching performance review', error: err.message });
  }
};

// Create performance review
const createPerformanceReview = async (req, res) => {
  const { employeeId, reviewerId, reviewDate, scores, comments, status } = req.body;

  try {
    // Step 1: Create review
    const review = await db.performanceReview.create({
      employeeId,
      reviewerId,
      reviewDate,
      scores,//: JSON.stringify(scores),
      comments,
      status
    });

    // Step 2: Refetch with associations
    const fullReview = await db.performanceReview.findByPk(review.id, {
      include: [
        { model: db.user, as: 'employee' },
        { model: db.user, as: 'reviewer' }
      ]
    });

    res.status(201).json(fullReview);
  } catch (err) {
    res.status(500).json({ message: 'Error creating performance review', error: err.message });
  }
};


// Update performance review
const updatePerformanceReview = async (req, res) => {
  const { id } = req.params;
  const { scores, comments, status } = req.body;
  
  try {
    const review = await db.performanceReview.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    
    review.scores = JSON.stringify(scores || review.scores);
    review.comments = comments || review.comments;
    review.status = status || review.status;
    
    await review.save();
    
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error updating performance review', error: err.message });
  }
};

// Delete performance review
const deletePerformanceReview = async (req, res) => {
  const { id } = req.params;
  
  try {
    const review = await db.performanceReview.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    
    await review.destroy();
    res.json({ message: 'Performance review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting performance review', error: err.message });
  }
};

// Get performance metrics
// const getPerformanceMetrics = async (req, res) => {
//   try {
//     // First get all reviews with scores
//     const allReviews = await db.performanceReview.findAll({
//     include: [{ model: db.user, as: 'employee' }],
//     raw: true,
//     nest: true
//     });

//     // Calculate averages manually
//     let totals = {
//       quality: 0,
//       productivity: 0,
//       initiative: 0,
//       teamwork: 0,
//       communication: 0
//     };
//     let count = 0;

//     allReviews.forEach(review => {
//       const scores = typeof review.scores === 'string' ? 
//         JSON.parse(review.scores) : review.scores;
      
//       if (scores) {
//         totals.quality += scores.quality || 0;
//         totals.productivity += scores.productivity || 0;
//         totals.initiative += scores.initiative || 0;
//         totals.teamwork += scores.teamwork || 0;
//         totals.communication += scores.communication || 0;
//         count++;
//       }
//     });

//     const metrics = {
//       quality: count > 0 ? totals.quality / count : 0,
//       productivity: count > 0 ? totals.productivity / count : 0,
//       initiative: count > 0 ? totals.initiative / count : 0,
//       teamwork: count > 0 ? totals.teamwork / count : 0,
//       communication: count > 0 ? totals.communication / count : 0
//     };

//     console.log("metrics",metrics);

//     // Rest of the function remains the same...
//     // Get top performers
//     const topPerformers = await db.performanceReview.findAll({
//     include: [{ model: db.user, as: 'employee' }],
//     order: [
//         [
//         db.sequelize.literal(`
//             (
//             CAST(JSON_UNQUOTE(JSON_EXTRACT(scores, '$.quality')) AS DECIMAL(10,2)) + 
//             CAST(JSON_UNQUOTE(JSON_EXTRACT(scores, '$.productivity')) AS DECIMAL(10,2)) + 
//             CAST(JSON_UNQUOTE(JSON_EXTRACT(scores, '$.initiative')) AS DECIMAL(10,2)) + 
//             CAST(JSON_UNQUOTE(JSON_EXTRACT(scores, '$.teamwork')) AS DECIMAL(10,2)) + 
//             CAST(JSON_UNQUOTE(JSON_EXTRACT(scores, '$.communication')) AS DECIMAL(10,2))
//             ) / 5
//         `),
//         'DESC'
//         ]
//     ],
//     limit: 5,
//     raw: true,
//     nest: true
//     });

//     // Get review status counts
//     const statusCounts = await db.performanceReview.findAll({
//       attributes: [
//         'status',
//         [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
//       ],
//       group: ['status'],
//       raw: true
//     });

//     res.json({
//       metrics,
//       topPerformers: topPerformers.map(p => {
//         const scores = typeof p.scores === 'string' ? JSON.parse(p.scores) : p.scores;
//         return {
//           id: p.employee.id,
//           name: p.employee.username,
//           position: p.employee.position,
//           score: ((scores.quality + 
//                  scores.productivity + 
//                  scores.initiative + 
//                  scores.teamwork + 
//                  scores.communication) / 5)
//         };
//       }),
//       statusCounts
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching performance metrics', error: err.message });
//   }
// };
const getPerformanceMetrics = async (req, res) => {
  try {
    // Get average scores by category
    const avgScores = await db.performanceReview.findAll({
      attributes: [
        [db.sequelize.literal(`JSON_EXTRACT(scores, '$.quality')`), 'quality'],
        [db.sequelize.literal(`JSON_EXTRACT(scores, '$.productivity')`), 'productivity'],
        [db.sequelize.literal(`JSON_EXTRACT(scores, '$.initiative')`), 'initiative'],
        [db.sequelize.literal(`JSON_EXTRACT(scores, '$.teamwork')`), 'teamwork'],
        [db.sequelize.literal(`JSON_EXTRACT(scores, '$.communication')`), 'communication']
      ],
      raw: true
    });
    

    // Calculate averages
    const metrics = {
      quality: avgScores.reduce((sum, item) => sum + parseFloat(item.quality || 0), 0) / avgScores.length,
      productivity: avgScores.reduce((sum, item) => sum + parseFloat(item.productivity || 0), 0) / avgScores.length,
      initiative: avgScores.reduce((sum, item) => sum + parseFloat(item.initiative || 0), 0) / avgScores.length,
      teamwork: avgScores.reduce((sum, item) => sum + parseFloat(item.teamwork || 0), 0) / avgScores.length,
      communication: avgScores.reduce((sum, item) => sum + parseFloat(item.communication || 0), 0) / avgScores.length
    };

    // Get top performers
    const topPerformers = await db.performanceReview.findAll({
      include: [{ model: db.user, as: 'employee' }],
      order: [[db.sequelize.literal(`(JSON_EXTRACT(scores, '$.quality') + JSON_EXTRACT(scores, '$.productivity') + JSON_EXTRACT(scores, '$.initiative') + JSON_EXTRACT(scores, '$.teamwork') + JSON_EXTRACT(scores, '$.communication')) / 5`), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });

    // Get review status counts
    const statusCounts = await db.performanceReview.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    res.json({
      metrics,
      topPerformers: topPerformers.map(p => ({
        id: p.employee.id,
        name: p.employee.username,
        position: p.employee.position,
        score: ((JSON.parse(p.scores).quality + 
               JSON.parse(p.scores).productivity + 
               JSON.parse(p.scores).initiative + 
               JSON.parse(p.scores).teamwork + 
               JSON.parse(p.scores).communication) / 5)
      })),
      statusCounts
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching performance metrics', error: err.message });
  }
};

// Settings methods
const getPerformanceSettings = async (req, res) => {
  try {
    const settings = await db.performanceSetting.findOne();
    res.json(settings || {
      reviewFrequency: 'quarterly',
      ratingScale: 5,
      selfAssessment: true,
      peerAssessment: false,
      managerAssessment: true
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings', error: err.message });
  }
};

const updatePerformanceSettings = async (req, res) => {
  try {
    const [settings] = await db.performanceSetting.upsert({
      id: 1, // Single settings record
      ...req.body
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
};

const getPerformanceCriteria = async (req, res) => {
  try {
    const criteria = await db.performanceCriterion.findAll();
    res.json(criteria);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching criteria', error: err.message });
  }
};

const updatePerformanceCriteria = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.performanceCriterion.destroy({ where: {}, transaction: t });
      
      if (req.body.criteria && req.body.criteria.length > 0) {
        await db.performanceCriterion.bulkCreate(req.body.criteria, { transaction: t });
      }
    });
    
    const criteria = await db.performanceCriterion.findAll();
    res.json(criteria);
  } catch (err) {
    res.status(500).json({ message: 'Error updating criteria', error: err.message });
  }
};

module.exports = {
  getPerformanceReviews,
  getPerformanceReviewById,
  createPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  getPerformanceMetrics,
  getPerformanceSettings,
  updatePerformanceSettings,
  getPerformanceCriteria,
 updatePerformanceCriteria
};