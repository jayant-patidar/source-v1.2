import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  DOB: Date;
  phone: string;
  address: {
    unit?: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    county?: string;
  };
  providerProfile?: {
    skills: string[];
    serviceCategories: string[];
    serviceRadius?: number;
    availability?: string;
  };
  seekerProfile?: {
    requestCategories: string[];
    preferredTopics: string[];
    defaultLocation?: string;
  };
  seekerRating: number;
  providerRating: number;
  about?: string;
  avatar?: string;
  preferences?: {
    jobTypes: string[];
    categories: string[];
    minPay?: number;
    location?: string;
  };
  skills?: string[];
  portfolio?: {
    title: string;
    link: string;
    description?: string;
  }[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  savedJobs?: string[];
  availability?: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    DOB: { type: Date, required: true },
    phone: { type: String, required: true },
    address: {
      unit: { type: String },
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true, enum: ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'] },
      postalCode: { type: String, required: true },
      county: { type: String }
    },
    providerProfile: {
      skills: [{ type: String }],
      serviceCategories: [{ type: String }],
      serviceRadius: { type: Number },
      availability: { type: String }
    },
    seekerProfile: {
      requestCategories: [{ type: String }],
      preferredTopics: [{ type: String }],
      defaultLocation: { type: String }
    },
    seekerRating: { type: Number, default: 0, min: 0, max: 5 },
    providerRating: { type: Number, default: 0, min: 0, max: 5 },
    about: { type: String, required: false },
    avatar: { type: String, required: false },
    preferences: {
      jobTypes: [{ type: String }],
      categories: [{ type: String }],
      minPay: { type: Number },
      location: { type: String }
    },
    skills: [{ type: String }],
    portfolio: [{
      title: { type: String, required: true },
      link: { type: String, required: true },
      description: { type: String }
    }],
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      website: { type: String }
    },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    availability: { type: String }
  },
  { timestamps: true }
);

// Pre-save hook to hash password
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Method to check password match (keeping existing logic)
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

export default mongoose.model<IUser>('User', UserSchema);
