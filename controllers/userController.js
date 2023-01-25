import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'
import User from '../models/user.js'


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
    
    res.status(200).json(
      // _id: user._id,
      token
    )
  } else {
    throw new Error("Email or Password is invalid")
  }

})
