const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: document,
    });
  });

exports.getOne = (Model, populationOPt) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populationOPt) {
      query = query.populate(populationOPt);
    }
    const document = await query;
    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocs = await Model.countDocuments();
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter(modelName)
      .fields()
      .sort()
      .paginate(countDocs);
    //execute query
    const { query, paginationResult } = features;
    const documents = await query;

    res.status(200).json({
      status: "success",
      result: documents.length,
      paginationResult,
      data: documents,
    });
  });
