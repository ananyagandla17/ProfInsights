const Professor = require('../models/Professor');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all professors
// @route   GET /api/professors
// @access  Public
exports.getProfessors = asyncHandler(async (req, res) => {
  const professors = await Professor.find();
  res.status(200).json({ success: true, count: professors.length, data: professors });
});

// @desc    Get single professor
// @route   GET /api/professors/:id
// @access  Public
exports.getProfessor = asyncHandler(async (req, res, next) => {
  const professor = await Professor.findById(req.params.id);
  if (!professor) {
    return next(new ErrorResponse(`No professor with id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: professor });
});

// @desc    Create professor
// @route   POST /api/professors
// @access  Private (admin only)
exports.createProfessor = asyncHandler(async (req, res) => {
  const professor = await Professor.create(req.body);
  res.status(201).json({ success: true, data: professor });
});

// @desc    Update professor
// @route   PUT /api/professors/:id
// @access  Private (admin only)
exports.updateProfessor = asyncHandler(async (req, res, next) => {
  let professor = await Professor.findById(req.params.id);
  if (!professor) {
    return next(new ErrorResponse(`Professor not found with id ${req.params.id}`, 404));
  }

  professor = await Professor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: professor });
});

// @desc    Delete professor
// @route   DELETE /api/professors/:id
// @access  Private (admin only)
exports.deleteProfessor = asyncHandler(async (req, res, next) => {
  const professor = await Professor.findById(req.params.id);
  if (!professor) {
    return next(new ErrorResponse(`Professor not found with id ${req.params.id}`, 404));
  }

  await professor.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Search professors by keyword
// @route   GET /api/professors/search?keyword=xyz
// @access  Public
exports.searchProfessors = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || '';
  const regex = new RegExp(keyword, 'i');
  const professors = await Professor.find({ name: regex });

  res.status(200).json({ success: true, data: professors });
});

// @desc    Get professor by exact name
// @route   GET /api/professors?name=...
// @access  Public
// @desc    Get all professors or search by name
// @route   GET /api/professors
// @access  Public
exports.getProfessors = asyncHandler(async (req, res, next) => {
  const { name } = req.query;

  let query = {};
  if (name) {
    query.name = { $regex: new RegExp(name, 'i') }; // case-insensitive match
  }

  const professors = await Professor.find(query);

  res.status(200).json({
    success: true,
    count: professors.length,
    data: professors
  });
});

