import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @route   POST /api/auth/login
 * @desc    Login admin user
 * @access  Public
 */
// @ts-ignore
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
        return;
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
        return;
    }

    // Check if user is active
    if (!user.isActive) {
        res.status(401).json({
            success: false,
            message: 'Account is deactivated. Please contact administrator.',
        });
        return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
        return;
    }

    // Generate tokens
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        },
    });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({
            success: false,
            message: 'Refresh token is required',
        });
        return;
    }

    try {
        const { verifyToken } = await import('../utils/jwt');
        const decoded = verifyToken(refreshToken);

        // Generate new access token
        const newAccessToken = generateAccessToken({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
// @ts-ignore
export const getMe = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Not authenticated',
        });
        return;
    }

    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found',
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        },
    });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
// @ts-ignore
export const logout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // In a stateless JWT system, logout is handled client-side by removing the token
    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});
