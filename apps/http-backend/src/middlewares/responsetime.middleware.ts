import {Request,Response,NextFunction} from 'express'

export const reponseTimeMiddleware= ()=> (req:Request, res:Response, next:NextFunction) => {
  // Record the start time
  const start = performance.now();

  // Listen for the 'finish' event on the response object
  res.on('finish', () => {
    // Record the end time
    const end = performance.now();
    const duration = end - start;
    
    console.log(`[${req.method}] ${req.originalUrl} took ${duration.toFixed(2)}ms`);
  });

  // Call next() to pass control to your actual routes/controllers
  next(); 
};