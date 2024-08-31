// errorhandlermiddleware.js
const { HTTP_STATUS_CODES } = require('../constants/constants');

const errorhandler = async (err, req, res, next) => {
  const statusCode = res && res.statusCode ? res.statusCode : 500;

  let errorTitle;

  switch (statusCode) {
    case HTTP_STATUS_CODES.VALIDATION_ERROR:
      errorTitle = 'Validation Failed';
      break;
    case HTTP_STATUS_CODES.UNAUTHORIZED:
      errorTitle = 'Unauthorized';
      break;
    case HTTP_STATUS_CODES.FORBIDDEN:
      errorTitle = 'Forbidden';
      break;
    case HTTP_STATUS_CODES.NOT_FOUND:
      errorTitle = 'Not Found';
      break;
    default:
      console.error('Unknown Status Code:', statusCode);
      break;
  }

  if (res && res.json) {
    try {
      res.json({
        title: errorTitle,
        message: err.message,
        stackTrace: err.stack,
      });
    } catch (jsonError) {
      console.error('Error sending JSON response:', jsonError);
      // Log additional information for debugging
      console.error('Original error:', err);
      // Send a plain text response
      await sendPlainTextResponse(res);
    }
  } else {
    console.error('Error: Unable to send JSON response');
    // Log additional information for debugging
    console.error('Original error:', err);
    // Send a plain text response
    await sendPlainTextResponse(res);
  }
};

// Helper function to send a plain text response
const sendPlainTextResponse = async (res) => {
  if (res && res.status) {
    await res.status(500).send('Internal Server Error');
  } else {
    console.error('Error: Unable to send plain text response');
  }
};

module.exports = errorhandler;

