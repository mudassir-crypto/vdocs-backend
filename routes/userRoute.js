import express from 'express'
import { body, param } from 'express-validator'
import { register, login, test, metamaskValidation, getCurrentUser, searchUser, getUserById, sendForVerification, verifyStudent } from '../controllers/userController.js'
import { customRole, isLoggedIn } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/register')
  .post([
    body("name").trim().escape(),
    body("email").isEmail().trim().escape(),
    body("password").trim().escape(),
    body("phone").trim().escape(),
    body("DOB").trim().escape(),
    body("gender").trim().escape(),
    body("sscScore").trim().escape(),
    body("hscScore").trim().escape(),
    body("jeeScore").trim().escape(),
    body("cetScore").trim().escape(),
    body("AdmissionType").trim().escape(),
    body("category").trim().escape(),
    body("passingYear").trim().escape()
  ], register)

router.route('/login')
  .post([
    body("email").isEmail().trim().escape(),
    body("password").trim().escape()
  ], login)

router.route("/getCurrentUser")
  .get(isLoggedIn, getCurrentUser)

router.route("/searchUser")
  .get(isLoggedIn, customRole("admin"), [
    body("search").trim().escape()
  ], searchUser)

router.route("/user/:id")
  .get(isLoggedIn, customRole("admin"), [
    param("id").trim().escape()
  ], getUserById)

router.route("/metamask")
  .post(isLoggedIn, [
    body("metamask").trim().escape()
  ], metamaskValidation)

router.route("/requestVerification")
  .patch(isLoggedIn, sendForVerification)

router.route("/verifyStudent/:userId")
  .patch(isLoggedIn, customRole("admin"), verifyStudent)
  
export default router