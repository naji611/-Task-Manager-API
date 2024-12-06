const crypto = require("crypto");

const generatePassword = (length = 12) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
};

module.exports = generatePassword;
