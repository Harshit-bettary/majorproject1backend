const bcrypt = require('bcrypt');

// Generate a random string and hash it
const generateTokenString = async () => {
  const randomString = Math.random().toString(36).substring(2, 15) + Date.now().toString(36); 
  const saltRounds = 10; 
  const hashedToken = await bcrypt.hash(randomString, saltRounds); 
  return hashedToken;
};

module.exports = generateTokenString;
