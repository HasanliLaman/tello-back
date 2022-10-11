const catchAsync = require("./catchAsync");
const GlobalError = require("../error/GlobalError");
const GlobalFilter = require("./GlobalFilter");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const query = new GlobalFilter(Model.find(), req.query);
    query.filter().sort().fields().paginate();
    const doc = await query.query;

    res.status(200).json({
      status: "success",
      length: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findById(id);

    if (!doc) return next(new GlobalError("Invalid ID!", 404));

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new GlobalError("Invalid ID!", 404));

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) return next(new GlobalError("Invalid ID!", 404));

    res.status(200).json({
      status: "success",
    });
  });
