// Middleware to handle async operations and errors
const AsyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('Error:', error);
  
      // Check if headers have been sent, if not, send an error response
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  };
  
  // Example route using AsyncHandler
  const exampleRoute = AsyncHandler(async (req, res) => {
    // Some asynchronous operation
    const data = await someAsyncFunction();
  
    // Send JSON response
    res.json({ data });
  });
  module.exports = AsyncHandler;