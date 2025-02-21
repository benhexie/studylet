import { Request, Response } from "express";
import Assessment from "../models/Assessment";
import PracticeSession from "../models/PracticeSession";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";
import { parseAssessmentFile } from "../services/assessmentParser";
import fs from "fs/promises";
import pdf from "pdf-parse";
import { generateQuestions } from "../services/openaiService";
import mongoose from "mongoose";
import { IUser } from "../models/User";

export const getAssessments = async (
  req: Request & { user: IUser },
  res: Response
) => {
  try {
    // Find assessments that are either public or created by the user
    const assessments = await Assessment.find({
      $or: [
        { createdBy: req.user._id }, // User's own assessments
        { isPublic: true }, // Public assessments
      ],
    })
      .select("title subject questions difficulty createdAt lastAttempt score")
      .sort("-createdAt");

    // Get last attempt for each assessment
    const assessmentsWithAttempts = await Promise.all(
      assessments.map(async (assessment) => {
        const lastAttempt = await PracticeSession.findOne({
          user: req.user._id,
          assessment: assessment._id,
        })
          .sort({ completedAt: -1 })
          .select("score completedAt")
          .lean();

        return {
          ...assessment.toObject(),
          lastAttempt: lastAttempt?.completedAt,
          score: lastAttempt?.score,
        };
      })
    );

    res.json(assessmentsWithAttempts);
  } catch (error) {
    console.error("Get Assessments Error:", error);
    res.status(500).json({ message: "Failed to fetch assessments" });
  }
};

export const getAssessment = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findById(req.params.id).select(
      "title questions subject difficulty"
    );

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadAssessment = async (
  req: Request & { user: IUser },
  res: Response
) => {
  try {
    const { title, subject, questionCount = 20, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "No content provided" });
    }

    // Generate questions using OpenAI
    const questions = await generateQuestions(content, parseInt(questionCount));

    // Create assessment without document field
    const assessment = new Assessment({
      title,
      subject,
      questions,
      createdBy: req.user._id,
    });

    await assessment.save();

    res.status(201).json({
      message: "Assessment created successfully",
      assessment: {
        id: assessment._id,
        title: assessment.title,
        subject: assessment.subject,
        questionCount: assessment.questions.length,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to process document" });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const assessment = await Assessment.findById(req.params.id).select(
      "questions"
    );

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Remove correct answers before sending to client
    const questions = assessment.questions.map((q) => ({
      id: q._id,
      text: q.text,
      options: q.options,
    }));

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const submitPractice = async (req: Request, res: Response) => {
  try {
    const { id: assessmentId } = req.params;
    const { answers, timeSpent } = req.body;
    const userId = (req as any).user._id;

    // Calculate score
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    let correctAnswers = 0;
    assessment.questions.forEach((question, index) => {
      // Convert the answer index to string to match with options array
      const userAnswer = answers[index.toString()];
      const correctAnswer =
        question.options[question.options.indexOf(question.correctAnswer)];

      console.log(`Question ${index}:`, {
        userAnswer: question.options[parseInt(userAnswer)],
        correctAnswer,
        isCorrect: question.options[parseInt(userAnswer)] === correctAnswer,
      });

      if (question.options[parseInt(userAnswer)] === correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore =
      (correctAnswers / assessment.questions.length) * 100;

    // Save practice session
    const practiceSession = await PracticeSession.create({
      user: userId,
      assessment: assessmentId,
      score: calculatedScore,
      timeSpent,
      answers,
    });

    // Return the full session
    res.json(await practiceSession.populate("assessment"));
  } catch (error) {
    console.error("Submit practice error:", error);
    res.status(500).json({ message: "Failed to submit practice" });
  }
};

export const getPracticeSessions = async (req: Request, res: Response) => {
  try {
    const { assessmentId } = req.params;
    const userId = (req as any).user._id;

    const sessions = await PracticeSession.find({
      assessment: assessmentId,
      user: userId,
    })
      .sort({ completedAt: -1 }) // Most recent first
      .select("score timeSpent completedAt answers");

    res.json(sessions);
  } catch (error) {
    console.error("Get practice sessions error:", error);
    res.status(500).json({ message: "Failed to get practice sessions" });
  }
};

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Assessment.distinct("subject");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getResults = async (
  req: Request & { user: IUser },
  res: Response
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });

    // Find practice session by assessment ID
    const practiceSession = await PracticeSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select("score timeSpent answers completedAt assessment");

    if (!practiceSession)
      return res.status(404).json({ message: "Practice session not found" });

    // Then find the associated assessment
    const assessment = await Assessment.findById(
      practiceSession.assessment
    ).select("title subject questions");

    if (!assessment)
      return res.status(404).json({ message: "Assessment not found" });

    res.json({
      assessment: {
        title: assessment.title,
        subject: assessment.subject,
        questions: assessment.questions,
      },
      practiceSession: {
        score: practiceSession.score,
        timeSpent: practiceSession.timeSpent,
        answers: practiceSession.answers,
        completedAt: practiceSession.completedAt,
      },
    });
  } catch (error) {
    console.error("Results Error:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};
