// controllers/referral.controller.js
import ReferralCode from '../models/referralModel.js';

// Generate Referral Code
const generateReferralCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if a referral code already exists for this email
    const existingCode = await ReferralCode.findOne({ email });
    
    if (existingCode) {
      return res.status(200).json({
        success: true,
        message: 'Existing referral code retrieved',
        data: {
          email,
          referralCode: existingCode.code,
          expiresIn: '24 hours',
          expiresAt: existingCode.createdAt.getTime() + (24 * 60 * 60 * 1000) // Add 24 hours to creation time
        }
      });
    }

    // If no existing code, generate new one
    // Extract first two characters of email and convert to uppercase
    const firstTwoChars = email.substring(0, 2).toUpperCase();
    
    // Extract characters before @ and get last two characters in uppercase
    const beforeAt = email.split('@')[0];
    const lastTwoChars = beforeAt.slice(-2).toUpperCase();
    
    // Generate 4 random numbers
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    
    // Combine to create the referral code
    const referralCode = `${firstTwoChars}${randomNumbers}${lastTwoChars}`;

    // Create new referral code
    const newReferralCode = new ReferralCode({
      email,
      code: referralCode
    });

    await newReferralCode.save();

    res.status(201).json({
      success: true,
      message: 'Referral code generated successfully',
      data: {
        email,
        referralCode,
        expiresIn: '24 hours',
        expiresAt: newReferralCode.createdAt.getTime() + (24 * 60 * 60 * 1000)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating referral code',
      error: error.message
    });
  }
};

// Verify Referral Code
const verifyReferralCode = async (req, res) => {
  try {
    const { code } = req.body;

    const referral = await ReferralCode.findOne({ code });

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired referral code'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Valid referral code',
      data: {
        email: referral.email,
        code: referral.code
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying referral code',
      error: error.message
    });
  }
};

export { generateReferralCode, verifyReferralCode };