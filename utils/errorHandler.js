const errorHandler = (res, error, message = 'Something went wrong') => {
    console.error(error);
    res.status(500).json({ message, error: error.message });
  };
  
  module.exports = errorHandler;
  