import { Request, Response } from 'express';
import PracticeSession from '../models/PracticeSession';
import { Types } from 'mongoose';
import { IUser } from '../models/User';

// Define interfaces for type safety
interface IAssessment {
  _id: Types.ObjectId;
  title: string;
}

interface IPracticeSession {
  _id: Types.ObjectId;
  score: number;
  timeSpent: string;
  completedAt: Date;
  assessment: IAssessment;
}

export const getStatistics = async (req: Request & { user: IUser }, res: Response) => {
  try {
    // Get all practice sessions for the user
    const sessions = await PracticeSession.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .populate<{ assessment: IAssessment }>('assessment', 'title');

    // Calculate total study hours from timeSpent strings (format: "MM:SS" or "HH:MM:SS")
    const totalMinutes = sessions.reduce((total, session) => {
      const timeSpent = session.timeSpent;
      const parts = timeSpent.split(':').map(Number);
      
      if (parts.length === 2) {
        // Format is "MM:SS"
        return total + parts[0]; // Add minutes
      } else if (parts.length === 3) {
        // Format is "HH:MM:SS"
        return total + (parts[0] * 60) + parts[1]; // Convert hours to minutes and add minutes
      }
      return total;
    }, 0);

    const studyHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place

    // Calculate other statistics
    const completedAssessments = sessions.length;
    const averageScore = sessions.length > 0
      ? sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length
      : 0;

    // Get recent activity
    const recentActivity = sessions.slice(0, 10).map(session => ({
      id: session._id,
      type: 'practice',
      description: `Completed ${session.assessment.title} - Score: ${session.score.toFixed(1)}%`,
      date: session.completedAt,
      score: session.score,
    }));

    res.json({
      completedAssessments,
      averageScore,
      studyHours,
      recentActivity,
    });
  } catch (error) {
    console.error('Statistics Error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
}; 