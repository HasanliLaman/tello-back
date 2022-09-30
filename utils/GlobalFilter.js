class GlobalFilter {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const restrictedFields = ["fields", "sort", "limit", "page"];
    const copyQueryString = { ...this.queryString };
    restrictedFields.forEach((el) => delete copyQueryString[el]);

    let filterStr = JSON.stringify(copyQueryString);
    filterStr = filterStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (atomic) => `$${atomic}`
    );

    this.query = this.query.find(JSON.parse(filterStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortStr = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fieldsStr = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldsStr);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const limit = this.queryString.limit || 50;
    const page = this.queryString.page || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = GlobalFilter;
