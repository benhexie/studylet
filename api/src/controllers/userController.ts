import { Request, Response } from 'express';
import User from '../models/User';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    const allowedUpdates = ['name', 'email', 'studentId'];
    
    // Handle text fields
    allowedUpdates.forEach(field => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    // Handle avatar file
    if (req.file) {
      try {
        // Upload to Cloudinary
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'avatars',
            transformation: [
              { width: 400, height: 400, crop: 'fill' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ],
          },
          async (error, result) => {
            if (error) {
              return res.status(500).json({ message: 'Image upload failed' });
            }

            updates.avatar = result?.secure_url;

            // Update user with all changes including avatar
            const user = await User.findByIdAndUpdate(
              req.user._id,
              { $set: updates },
              { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
          }
        );

        bufferToStream(req.file.buffer).pipe(stream);
      } catch (error) {
        res.status(500).json({ message: 'Image upload failed' });
      }
    } else {
      // Update user without avatar
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 