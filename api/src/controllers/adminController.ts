import { Request, Response } from 'express';
import User from '../models/User';
import Assessment from '../models/Assessment';
import { generateQuestions } from '../services/openaiService';
import jwt from 'jsonwebtoken';

const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    // Set cookie and send response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAssessment = async (req: Request, res: Response) => {
  try {
    const { title, subject, questionCount = 20, content } = req.body;

    if (!content) 
      return res.status(400).json({ message: 'No content provided' });
    
    // Generate questions using OpenAI
    const questions = await generateQuestions(content, parseInt(questionCount));

    // Create public assessment
    const assessment = new Assessment({
      title,
      subject,
      questions,
      createdBy: req.user._id,
      isPublic: true,
    });

    await assessment.save();

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment: {
        id: assessment._id,
        title: assessment.title,
        subject: assessment.subject,
        questionCount: assessment.questions.length,
      },
    });
  } catch (error) {
    console.error('Create Assessment Error:', error);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
};

const getAssessments = async (req: Request, res: Response) => {
  try {
    const assessments = await Assessment.find({ isPublic: true })
      .select('title subject questions createdAt')
      .sort('-createdAt');

    res.json(assessments);
  } catch (error) {
    console.error('Get Assessments Error:', error);
    res.status(500).json({ message: 'Failed to fetch assessments' });
  }
};

const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (!assessment.isPublic) {
      return res.status(403).json({ message: 'Cannot delete private assessment' });
    }

    await assessment.deleteOne();
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete Assessment Error:', error);
    res.status(500).json({ message: 'Failed to delete assessment' });
  }
};

const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalAssessments = await Assessment.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Assessment.aggregate([
      { $unwind: "$questions" },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);

    res.json({
      totalAssessments,
      totalUsers,
      totalQuestions: totalQuestions[0]?.total || 0,
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

export {
  adminLogin,
  createAssessment,
  getAssessments,
  deleteAssessment,
  getAdminStats,
}; 