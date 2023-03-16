import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  sscScore: {
    type: Number,
    required: true,
    min: 50,
    max: 100
  },
  hscScore: {
    type: Number,
    min: 50,
    max: 100
  },
  jeeScore: {
    type: Number,
    min: 50,
    max: 100
  },
  cetScore: {
    type: Number,
    min: 50,
    max: 100
  },
  AdmissionType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  passingYear: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  metamask: {
    type: String
  },
  status: {
    type: String,
    required: [true, "Select a status from: pending, verified, rejected"],
    enum: {
      values: [
        "pending",
        "verified",
        "rejected",
      ],
      message: "Select a status from: pending, verified, rejected"
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

userSchema.methods = {
  matchPassword: async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
  },
  getJwtToken: function(){
    return jwt.sign(
      {id: this._id},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRY}
    )
  }
}

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model('User', userSchema)