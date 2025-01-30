import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (excluding password)
    const userData = await User.findById(user._id).select('-password');
    res.status(201).json({
      user: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (excluding password)
    const userData = await User.findById(user._id).select('-password');
    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the user document with an expiration
    // 3. Send an email with a reset link

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const sanitizeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
}); 