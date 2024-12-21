import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique email for each user
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['Admin', 'User', 'Sp'], // Aligned with your role types
      required: true,
      default: 'User',
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'], // Aligned with your status types
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
    country: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

//pre save middleware/hook:will work om  create()  save()

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds),
      );
      next();
    } catch (err) {
      next(err as Error);
    }
  } else {
    next();
  }
});

//post save middleware / hook
// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Export the User Model
export const User = model<TUser>('User', userSchema);
