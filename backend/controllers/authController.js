const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register student
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, rollNumber, department, year } = req.body;

  // Validate Mahindra University email
  if (!email.endsWith('@mahindrauniversity.edu.in')) {
    return next(new ErrorResponse('Please use your Mahindra University email', 400));
  }

  // Create student
  const student = await Student.create({
    name,
    email,
    password,
    rollNumber,
    department,
    year,
    isVerified: false // Require email verification
  });

  // Generate verification token
  const verificationToken = student.getResetPasswordToken();
  await student.save({ validateBeforeSave: false });

  // Create verification URL
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

  const message = `You are receiving this email because you need to verify your email address. Please click the link to verify: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: student.email,
      subject: 'ProfInsights - Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your Mahindra University email.'
    });
  } catch (err) {
    student.resetPasswordToken = undefined;
    student.resetPasswordExpire = undefined;
    await student.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const student = await Student.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!student) {
    return next(new ErrorResponse('Invalid token or token expired', 400));
  }

  // Set verified to true
  student.isVerified = true;
  student.resetPasswordToken = undefined;
  student.resetPasswordExpire = undefined;
  await student.save();

  // Send token
  sendTokenResponse(student, 200, res);
});

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for student
  const student = await Student.findOne({ email }).select('+password');

  if (!student) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if email is verified
  if (!student.isVerified) {
    return next(new ErrorResponse('Please verify your email address first', 401));
  }

  // Check if password matches
  const isMatch = await student.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(student, 200, res);
});

// @desc    Log student out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in student
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.student.id);

  res.status(200).json({
    success: true,
    data: student
  });
});

// Helper function to send token response
const sendTokenResponse = (student, statusCode, res) => {
  // Create token
  const token = student.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        year: student.year,
        role: student.role
      }
    });
};