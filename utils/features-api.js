class featuresAPI {
  constructor(queryDB, queryStr) {
    this.query = queryDB;
    this.queryStr = queryStr;
  }

  filter() {
     //- Copied query object and clearing irelevant parameters
    const queryCopy = {...this.queryStr};
    const exludedParams = ['sort', 'limit', 'page', 'fields'];
    exludedParams.forEach((parameter) => delete queryCopy[parameter]);

    //- Checking is existing a query conditions and adding $ for correct shape
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    
    return this;
  }

  sort() {
    if(this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }

    return this;
  }

  limitFields() {
    if(this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
};

module.exports = featuresAPI;