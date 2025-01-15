import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema({
  // Authentication Details (populated after admin approval)
  email: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  commissionRate: {
    type: Number,
    default: 0
  },
  password: {
    type: String,
    select: false,
    required: true,
  },

  // Basic Details
  shopName: {
    type: String,
    required: [true, 'Firm/Shop name is required'],
    trim: true
  },
  proprietorName: {
    type: String,
    required: [true, 'Proprietor name is required'],
    trim: true
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: props => `${props.value} is not a valid Aadhar number! Must be 12 digits.`
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
    }
  },
  
  // Address Details
  registeredAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{6}$/.test(v);
        },
        message: props => `${props.value} is not a valid pincode! Must be 6 digits.`
      }
    }
  },
  warehouseAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{6}$/.test(v);
        },
        message: props => `${props.value} is not a valid pincode! Must be 6 digits.`
      }
    }
  },

  // Tax and Bank Details
  gstNumber: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(v);
      },
      message: props => `${props.value} is not a valid GST number!`
    }
  },
  bankDetails: {
    accountNumber: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{9,18}$/.test(v);
        },
        message: props => `${props.value} is not a valid account number!`
      }
    },
    ifscCode: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
        },
        message: props => `${props.value} is not a valid IFSC code!`
      }
    },
    bankName: {
      type: String,
      trim: true
    }
  },

  // Document Upload
  dealerCertificate: {
    url: { type: String},
    filename: { type: String },
    uploadDate: { type: Date, default: Date.now }
  },

  // Agreement
  agreementAccepted: {
    type: Boolean,
    required: [true, 'Must accept the agreement'],
    default: false
  },

  // Verification Status
  verificationStatus: {
    bankVerified: { type: Boolean, default: false },
    otpVerified: { type: Boolean, default: false },
    documentsValidated: { type: Boolean, default: false }
  },

  // Registration Status
  registrationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending'
  },
  
  // System Fields
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
sellerSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordUpdate = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastUpdated timestamp
sellerSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to compare password
sellerSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create indexes
sellerSchema.index({ phoneNumber: 1 });
sellerSchema.index({ gstNumber: 1 });
sellerSchema.index({ 'bankDetails.accountNumber': 1 });
sellerSchema.index({ registrationStatus: 1 });
sellerSchema.index({ accountStatus: 1 });

const Seller = mongoose.model('Seller', sellerSchema);

export default Seller;