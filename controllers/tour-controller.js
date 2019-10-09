//const fs = require('fs');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}\\..\\dev-data\\data\\tours-simple.json`));
const Tour = require('../models/tour-model');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'bad request',
      message: 'Must contain name and price'
    });
  };

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  
};

exports.updateTour = (req, res) => {
  res.status(500).json({
    status: 'success*_*',
    message: 'update not implemented yet'
  });
};

exports.deleteTour = (req, res) => {
  res.status(500).json({
    status: 'success*_*',
    message: 'delete not implemented yet'
  });
}