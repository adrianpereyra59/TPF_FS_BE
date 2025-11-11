import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const auth_router = express.Router();

auth_router.post('/register', AuthController.register);
auth_router.post('/login', AuthController.login);

auth_router.get('/verify-email/:verification_token', AuthController.verifyEmail);

auth_router.post('/verify-email', AuthController.verifyEmailPost);

auth_router.post('/forgot-password', AuthController.forgotPassword);
auth_router.post('/reset-password', AuthController.resetPassword);

auth_router.get('/me', authMiddleware, AuthController.me);

export default auth_router;