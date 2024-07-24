function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
 
    const results = {};
    let query = {};

    // Adjust query based on category
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    try {
      const totalDocuments = await model.countDocuments(query).exec();
      if (endIndex < totalDocuments) {
        results.next = {
          page: page + 1,
          limit,
        };
      }
      results.result = await model.find(query).limit(limit).skip(startIndex).exec();
      res.paginatedResult = results;
      next();
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

module.exports = paginatedResults;
