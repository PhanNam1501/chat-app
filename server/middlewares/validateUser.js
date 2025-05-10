const { body, validationResult } = require("express-validator");

const registerValidationRules = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Name is required.")
    .isLength({ max: 50 }).withMessage("Name must be at most 50 characters."),
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Email must be valid."),
  body("password")
    .notEmpty().withMessage("Password is required.")
    .isStrongPassword().withMessage("Password must be strong."),
];

const loginValidationRules = [
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Invalid email."),
    body("password")
      .notEmpty().withMessage("Password is required."),
  ];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
