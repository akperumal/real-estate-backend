'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plot extends Model {
    static associate(models) {
      // Optional: Link to Layout later
    }
  }

  Plot.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'available',
      validate: { isIn: [['available', 'sold', 'reserved']] }
    },
    layoutId: DataTypes.INTEGER,
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Plot',
    timestamps: true
  });

  return Plot;
};
