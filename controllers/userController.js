import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/user.js'
import mongoose from 'mongoose'
import mailHelper from '../utils/emailHelper.js'

const ObjectId = mongoose.Types.ObjectId

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`)
  }
  const { name, email, password, phone, DOB, gender, sscScore, hscScore, jeeScore, cetScore, AdmissionType, passingYear, category } = req.body

  if(!name || !email || !password || !phone || !DOB || !gender || !sscScore || !hscScore || !jeeScore || !cetScore || !AdmissionType || !passingYear){
    res.status(401)
    throw new Error("Enter all required fields")
  }

  if(AdmissionType == "capRound" && !category){
    res.status(401)
    throw new Error("Category required")
  }

  try {
    const existingUser = await User.findOne({ email }) 
    if(existingUser){
      res.status(401)
      throw new Error("Email already exist")
    }
    
    const user = await User.create({
      name, email, password, phone, DOB, gender, sscScore, hscScore, jeeScore, cetScore, AdmissionType, passingYear, category
    })
  
    const token = user.getJwtToken()
    user.password = undefined
  
    return res.status(200).json({
      user,
      token
    })
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`)
  }

  const { email, password } = req.body

  const user = await User.findOne({ email })
  if(!user){
    throw new Error("Email does not exist, try signing up")
  }

  if(user && await user.matchPassword(password)){
    const token = user.getJwtToken()
    user.password = undefined
    
    res.status(200).json({
      user, token
    })
  } else {
    res.status(401)
    throw new Error("Email or Password is invalid")
  }
})

export const metamaskValidation = asyncHandler(async(req, res) => {

  const { metamask } = req.body

  if(metamask == "" || !metamask){
    res.status(401)
    throw new Error("Metamask does not match with this account")
  }

  const user = await User.findById(req.user._id).select("-__v -password")
  if(user.metamask){
    if(user.metamask !== metamask){
      res.status(401)
      throw new Error("Metamask does not match with this account")
    } else {
      return res.status(200).json({
        message: "Account matched",
        account: user.metamask
      })
    }
  }

  const metaUser = await User.find({ metamask })

  if(metaUser.length > 0){
    res.status(401)
    throw new Error("Account already exist with this metamask account")
  }
  user['metamask'] = metamask
  await user.save()

  return res.status(200).json({
    message: "Account created",
    account: user.metamask
  })
})

export const getCurrentUser = asyncHandler(async(req, res) => {
  res.status(200).json({
    user: req.user
  })
})

export const searchUser = asyncHandler(async (req, res) => {
  const { search } = req.query
  let searchQuery = search ? {
    name: {
      $regex: search,
      $options: 'i'
    }
  } : {}

  const users = await User.find({...searchQuery, role: "user"}).select("-password")

  if(users.length <= 0){
    return res.status(400).json({
      message: "No user found"
    })
  }

  res.status(200).json({ users })
})

export const getUserById = asyncHandler(async(req, res) => {
  const { id } = req.params

  if(!(ObjectId.isValid(id) && (String)(new ObjectId(id)) === id)){
    res.status(401)
    throw new Error("Id is invalid")
  }

  const user = await User.findById(id).select("-password")

  if(!user){
    res.status(400)
    throw new Error("User not found")
  }

  res.status(200).json({
    user
  })
})

export const test = asyncHandler(async(req, res) => {
  res.status(200).json({
    user: req.user
  })
})

export const sendForVerification = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id)
  const { status } = req.body

  await mailHelper({ 
    email: "vdocs.vit@gmail.com",
    subject: "Testing Email", 
    message: `
    <div>
      <p>Hello vdocsAdmin,</p>
      <p>Student: ${user.name} with email: ${user.email} has uploaded and requested verification of documents</p>
    </div>
    `
  })

  try {
    user.status = status
    await user.save()

    res.status(200).json({
      message: "Email is sent successfully"
    })

  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
  
})

export const verifyStudent = asyncHandler(async (req, res) => {
  const { userId } = req.params
  if(!userId){
    res.status(401)
    throw new Error("Invalid Id")
  }
  const user = await User.findById(userId)
  const { status } = req.body

  

  try {
    user.status = status
    const newUser = await user.save()

    await mailHelper({ 
      email: user.email,
      subject: newUser.status === "verified" ? "Documents verified" : "Documents rejected", 
      message: `
      <div>
        <p>Dear ${newUser.name},</p>
        <p>Your documents have been ${newUser.status}</p>
      </div>
      `
    })

    res.status(200).json({
      message: "Email is sent successfully"
    })

  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
  
})