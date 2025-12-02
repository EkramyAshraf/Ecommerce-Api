const qs = require("qs");

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(modelName) {
    //filtering
    const queryObj = qs.parse(this.queryString);
    const limitFields = ["page", "sort", "limit", "fields", "keyword"];
    limitFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    if (this.queryString.keyword) {
      if (modelName === "Product") {
        queryStr.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        queryStr.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }
    }
    this.query = this.query.find(queryStr);
    return this;
  }

  paginate(countDocs) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocs / limit);

    //next page
    if (countDocs > endIndex) {
      pagination.next = page + 1;
    }

    //previous page
    if (skip > 0) {
      pagination.previous = page - 1;
    }
    this.paginationResult = pagination;
    //building query
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy;
      if (typeof this.queryString.sort === "string") {
        sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else if (Array.isArray(this.queryString.sort)) {
        sortBy = this.queryString.sort.join(" ");
        this.query = this.query.sort(sortBy);
      }
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}

module.exports = ApiFeatures;
