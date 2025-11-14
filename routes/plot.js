const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  uploadImages,
  createPlot,
  getPlots,
  getPlot,
  updatePlot,
  deletePlot
} = require('../controllers/plotController');

// Public Routes
router.get('/', getPlots);
router.get('/:id', getPlot);

// Admin Routes
router.post('/', auth, admin, uploadImages, createPlot);
router.put('/:id', auth, admin, uploadImages, updatePlot);
router.delete('/:id', auth, admin, deletePlot);

module.exports = router;
