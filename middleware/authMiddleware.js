import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from '../models/user.js'

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    
    const token = req.header("Authorization").replace("Bearer ", "")
    
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(id).select("-__v -password")

    next()
  } catch (error) {
    res.status(401)
    throw new Error("You are not authenticated")
  }
})

export const customRole = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      res.status(401)
      throw new Error("You do not have the permission to access it")
    }
    next()
  }
}