import { Request, Response } from 'express';
import Assessment from '../models/Assessment';
import PracticeSession from '../models/PracticeSession';
import { Document } from 'mongoose';
import User, { IUser } from '../models/User';

// Add interface at the top
interface PopulatedSession extends Document {
  _id: string;
  assessment: {
    _id: string;
    title: string;
    subject: string;
  };
  score: number;
  completedAt: Date;
}

export const getDashboardStats = async (req: Request & { user: IUser }, res: Response) => {
  try {
    const userId = req.user._id;

    // Get total assessments
    const totalAssessments = await Assessment.countDocuments();

    // Get completed assessments and sessions
    const userSessions = await PracticeSession.find({ user: userId })
      .populate<{ assessment: PopulatedSession['assessment'] }>('assessment', 'title subject')
      .sort({ completedAt: -1 });

    const completedAssessments = new Set(userSessions.map(s => s.assessment._id.toString())).size;

    // Calculate average score
    const averageScore = userSessions.length > 0
      ? userSessions.reduce((acc, session) => acc + session.score, 0) / userSessions.length
      : 0;

    // Get recent sessions
    const recentSessions = userSessions.slice(0, 5).map(session => ({
      id: session._id,
      assessmentTitle: session.assessment.title,
      score: session.score,
      completedAt: session.completedAt,
    }));

    // Calculate subject performance
    const subjectPerformance = await PracticeSession.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'assessments',
          localField: 'assessment',
          foreignField: '_id',
          as: 'assessment'
        }
      },
      { $unwind: '$assessment' },
      {
        $group: {
          _id: '$assessment.subject',
          averageScore: { $avg: '$score' },
          assessmentCount: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: '$_id',
          averageScore: 1,
          assessmentCount: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalAssessments,
      completedAssessments,
      averageScore,
      recentSessions,
      subjectPerformance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
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