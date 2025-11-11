import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';

const auth_router = express.Router();

function asyncHandler(controllerPath, methodName) {
  return async (req, res, next) => {
    try {
      const module = await import(controllerPath);
      const Controller = module.default || module;
      const handler = Controller[methodName];
      if (typeof handler !== 'function') {
        console.error(`Handler ${methodName} not found on controller ${controllerPath}. Value:`, handler);
        return res.status(500).json({
          ok: false,
          status: 500,
          message: `Server configuration error: handler ${methodName} missing on controller.`,
        });
      }
      return handler(req, res, next);
    } catch (err) {
      console.error(`Error loading controller ${controllerPath}#${methodName}:`, err && err.stack ? err.stack : err);
      return res.status(500).json({ ok: false, status: 500, message: "Server error loading handler" });
    }
  };
}


auth_router.post('/register', asyncHandler('../controllers/auth.controller.js', 'register'));
auth_router.post('/login', asyncHandler('../controllers/auth.controller.js', 'login'));

auth_router.get('/verify-email/:verification_token', asyncHandler('../controllers/auth.controller.js', 'verifyEmail'));

auth_router.post('/verify-email', asyncHandler('../controllers/auth.controller.js', 'verifyEmailPost'));

auth_router.post('/forgot-password', asyncHandler('../controllers/auth.controller.js', 'forgotPassword'));
auth_router.post('/reset-password', asyncHandler('../controllers/auth.controller.js', 'resetPassword'));

auth_router.get('/me', authMiddleware, asyncHandler('../controllers/auth.controller.js', 'me'));

export default auth_router;