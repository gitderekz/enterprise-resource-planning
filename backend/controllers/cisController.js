const db = require('../models');
const { Op } = require('sequelize');

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await db.collectiveInvestmentScheme.findAll({
      include: [{
        model: db.cisNav,
        as: 'navHistory',
        limit: 1,
        order: [['date', 'DESC']]
      }]
    });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createScheme = async (req, res) => {
  try {
    const scheme = await db.collectiveInvestmentScheme.create(req.body);
    res.status(201).json(scheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single scheme by ID
exports.getScheme = async (req, res) => {
  try {
    const scheme = await db.collectiveInvestmentScheme.findByPk(req.params.id, {
      include: [
        { 
          model: db.cisNav,
          as: 'navHistory',
          limit: 10,
          order: [['date', 'DESC']]
        },
        {
          model: db.cisInvestment,
          as: 'investments'
        }
      ]
    });
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a scheme
exports.updateScheme = async (req, res) => {
  try {
    const [updated] = await db.collectiveInvestmentScheme.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedScheme = await db.collectiveInvestmentScheme.findByPk(req.params.id);
      res.json(updatedScheme);
    } else {
      res.status(404).json({ message: 'Scheme not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a scheme (soft delete)
exports.deleteScheme = async (req, res) => {
  try {
    const deleted = await db.collectiveInvestmentScheme.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Scheme deleted successfully' });
    } else {
      res.status(404).json({ message: 'Scheme not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all investments
exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await db.cisInvestment.findAll({
      include: [
        {
          model: db.collectiveInvestmentScheme,
          as: 'scheme'
        },
        {
          model: db.customer,
          as: 'customer'
        }
      ]
    });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an investment
exports.createInvestment = async (req, res) => {
  try {
    const investment = await db.cisInvestment.create(req.body);
    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single investment
exports.getInvestment = async (req, res) => {
  try {
    const investment = await db.cisInvestment.findByPk(req.params.id, {
      include: [
        {
          model: db.collectiveInvestmentScheme,
          as: 'scheme'
        },
        {
          model: db.customer,
          as: 'customer'
        }
      ]
    });
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an investment
exports.updateInvestment = async (req, res) => {
  try {
    const [updated] = await db.cisInvestment.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedInvestment = await db.cisInvestment.findByPk(req.params.id);
      res.json(updatedInvestment);
    } else {
      res.status(404).json({ message: 'Investment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an investment
exports.deleteInvestment = async (req, res) => {
  try {
    const deleted = await db.cisInvestment.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Investment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Investment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create NAV record
exports.createNAVRecord = async (req, res) => {
  try {
    const navRecord = await db.cisNav.create(req.body);
    res.status(201).json(navRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get CIS summary
exports.getCISSummary = async (req, res) => {
  try {
    const schemes = await db.collectiveInvestmentScheme.findAll({
      include: [{
        model: db.cisNav,
        as: 'navHistory',
        limit: 1,
        order: [['date', 'DESC']]
      }],
      attributes: [
        'id',
        'name',
        'status',
        'riskProfile',
        'totalUnits',
        'unitPrice',
        'managementFee',
        'performanceFee'
      ]
    });

    const investments = await db.cisInvestment.findAll({
      attributes: [
        [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'totalInvested'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'totalInvestors'],
        'schemeId'
      ],
      group: ['schemeId']
    });

    const summary = schemes.map(scheme => {
      const schemeInvestments = investments.find(inv => inv.schemeId === scheme.id);
      const latestNav = scheme.navHistory && scheme.navHistory[0] ? scheme.navHistory[0].navPerUnit : 0;
      
      return {
        id: scheme.id,
        name: scheme.name,
        status: scheme.status,
        riskProfile: scheme.riskProfile,
        totalUnits: scheme.totalUnits,
        unitPrice: scheme.unitPrice,
        latestNav,
        managementFee: scheme.managementFee,
        performanceFee: scheme.performanceFee,
        totalInvested: schemeInvestments ? schemeInvestments.totalInvested : 0,
        totalInvestors: schemeInvestments ? schemeInvestments.totalInvestors : 0,
        aum: latestNav * scheme.totalUnits
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNAVHistory = async (req, res) => {
  try {
    const navHistory = await db.cisNav.findAll({
      where: { schemeId: req.params.schemeId },
      order: [['date', 'ASC']]
    });
    res.json(navHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPerformanceReport = async (req, res) => {
  try {
    const { schemeId, startDate, endDate } = req.query;
    const where = { schemeId };
    
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const navRecords = await db.cisNav.findAll({
      where,
      order: [['date', 'ASC']]
    });

    if (navRecords.length < 2) {
      return res.json({ message: 'Not enough data for performance calculation' });
    }

    const firstNAV = navRecords[0].navPerUnit;
    const lastNAV = navRecords[navRecords.length - 1].navPerUnit;
    const performance = ((lastNAV - firstNAV) / firstNAV) * 100;

    res.json({
      startDate: navRecords[0].date,
      endDate: navRecords[navRecords.length - 1].date,
      startNAV: firstNAV,
      endNAV: lastNAV,
      performance: performance.toFixed(2) + '%',
      navHistory: navRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};