const Tour = require('../models/tour-model');
const featuresAPI = require('../utils/features-api');

exports.getCheapestTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingsAverage';
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new featuresAPI(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

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

exports.getStatsTours = async (req, res) => {
  try {
    const stat = await Tour.aggregate([
      {
        $match: {
          maxGroupSize: { $gte: 5 }
        }
      },
      { 
        $group: { 
          _id: '$difficulty',
          averageAll: { $avg: '$price' },
          averageMin: { $min: '$price' },
          averageMax: { $max: '$price' },
        } 
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: stat
    });    
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: 'We have error there :( ' + err
    })
  };
};

exports.getMonthTours = async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' 
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      { 
        $group: { 
          _id: { $month: '$startDates' },
          numTours: { $sum: 1 },
          tours: { $push: '$name' }
        } 
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: plan
    });    
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: 'We have error there :( ' + err
    })
  };
};