import { User } from 'model/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('User', () => {
  describe('generateAuthToken', () => {
    it('should return a valid JWT', () => {
      const payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };
      const user = new User(payload);
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, process.env.SECRET_KEY!);
      expect(decoded).toMatchObject(payload);
    });
  });
});
