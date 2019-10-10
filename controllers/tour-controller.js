//const fs = require('fs');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}\\..\\dev-data\\data\\tours-simple.json`));
const Tour = require('../models/tour-model');

exports.getCheapestTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingsAverage';
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    //- Copied query object and clearing irelevant parameters
    const queryCopy = {...req.query};
    const exludedParams = ['sort', 'limit', 'page', 'fields'];
    exludedParams.forEach((parametr) => delete queryCopy[parametr]);

    //- Checking is existing a query conditions and adding $ for correct shape
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //- Sorting data
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('createdAt');
    }

    //- Separating data only user want
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //- Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page) {
      const toursCount = Tour.countDocuments();
      if(skip > toursCount) throw new Error('Page 404')
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  };
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try{
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'We have error there :( ' + err
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      tour
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'We have error there :( ' + err
    })
  };
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: 'We have error there :( ' + err
    })
  };
};