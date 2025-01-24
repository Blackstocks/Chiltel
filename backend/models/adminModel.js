// models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 role: { type: String, enum: ['super-admin', 'sub-admin'], required: true },
 name: { type: String, required: true }
});

adminSchema.pre('save', async function(next) {
 if (this.isModified('password')) {
   this.password = await bcrypt.hash(this.password, 10);
 }
 next();
});

export default mongoose.model('Admin', adminSchema);