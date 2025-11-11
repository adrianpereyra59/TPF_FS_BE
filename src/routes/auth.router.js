import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const auth_router = express.Router();

function ensureHandler(fn, routeDescription) {
  if (typeof fn !== 'function') {
    console.error(`Route handler for ${routeDescription} is NOT a function. Value:`, fn);
    return (req, res) => {
      res.status(500).json({
        ok: false,
        status: 500,
        message: `Route handler not implemented on server (${routeDescription}). Check controller export.`,
      });
    };
  }
  return fn;
}


auth_router.post('/register', ensureHandler(AuthController.register, 'POST /api/auth/register'));
auth_router.post('/login', ensureHandler(AuthController.login, 'POST /api/auth/login'));


auth_router.get('/verify-email/:verification_token', ensureHandler(AuthController.verifyEmail, 'GET /api/auth/verify-email/:verification_token'));

auth_router.post('/verify-email', ensureHandler(AuthController.verifyEmailPost, 'POST /api/auth/verify-email'));

auth_router.post('/forgot-password', ensureHandler(AuthController.forgotPassword, 'POST /api/auth/forgot-password'));
auth_router.post('/reset-password', ensureHandler(AuthController.resetPassword, 'POST /api/auth/reset-password'));

auth_router.get('/me', authMiddleware, ensureHandler(AuthController.me, 'GET /api/auth/me'));

export default auth_router;