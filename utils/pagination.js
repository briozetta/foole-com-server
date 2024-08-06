function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startingPrice = parseFloat(req.query.startingPrice);
    const endingPrice = parseFloat(req.query.endingPrice);

    // Extract and clean category
    let category = req.query.category || '';
    let category2 = req.query.category2 || '';

    // Remove prefix like 'byCategory,' if present
    if (category.includes(',')) {
      category = category.split(',')[1].trim(); // Extract the part after the comma
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    let query = {};

    // Adjust query based on startingPrice and endingPrice
    if (startingPrice && endingPrice) {
      query = {
        price: { $gte: startingPrice, $lte: endingPrice }
      };
    } else {
      // Adjust query based on categories
      if (category && category.toLowerCase() !== "all" && category2 && category2.toLowerCase() !== "all") {
        query = {
          $or: [
            { category: category },
            { category: category2 }
          ] 
        };
      } else if (category && category.toLowerCase() !== "all") {
        query = { category: category };
      } else if (category2 && category2.toLowerCase() !== "all") {
        query = { category: category2 };
      }
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
      results.result = await model.find(query).sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec();
      res.paginatedResult = results;
      next();
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

module.exports = paginatedResults;
