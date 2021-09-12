const advancedResults = (model, populate) => async (req, res, next) => {
  //Getting a query
  let query;
  let reqQuery = { ...req.query };

  //Removing unwanted fields
  const removeFields = ["select", "sort", "limit", "page"];
  removeFields.forEach((params) => delete reqQuery[params]);

  //converting to string
  let queryStr = JSON.stringify(reqQuery);

  //Processing
  queryStr = queryStr.replace(
    /\b(gte|lte|gt|lt|in)\b/g,
    (match) => `$${match}`
  );
  //   Creating query
  query = model.find(JSON.parse(queryStr));
  // Check and work with select statements
  if (req.query.select) {
    const selectQuery = req.query.select.split(",").join(" ");
    query = query.select(selectQuery);
  }

  // Sorting according to provided parameter
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  const pagination = {};
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
