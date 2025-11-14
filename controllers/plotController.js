const { Plot } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Multer: Save files to /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
const uploadImages = upload.array('images', 10);

// CREATE (Admin)
const createPlot = async (req, res) => {
  try {
    const { title, description, size, price, status, layoutId } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const plot = await Plot.create({ title, description, size, price, status, layoutId, images });
    res.status(201).json(plot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL (Public)
const getPlots = async (req, res) => {
  try {
    const { status, minPrice, maxPrice, search } = req.query;
    let where = {};

    if (status) where.status = status;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const plots = await Plot.findAll({ where });
    res.json(plots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
const getPlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ message: 'Plot not found' });
    res.json(plot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (Admin)
const updatePlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ message: 'Plot not found' });

    const { title, description, size, price, status, layoutId } = req.body;
    const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    await plot.update({
      title, description, size, price, status, layoutId,
      images: [...plot.images, ...newImages]
    });

    res.json(plot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (Admin)
const deletePlot = async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) return res.status(404).json({ message: 'Plot not found' });

    // Delete images from disk
    plot.images.forEach(img => {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await plot.destroy();
    res.json({ message: 'Plot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadImages,
  createPlot,
  getPlots,
  getPlot,
  updatePlot,
  deletePlot
};
