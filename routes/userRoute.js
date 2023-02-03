import express from 'express'
import { body } from 'express-validator'
import { register, login, test, metamaskValidation } from '../controllers/userController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'

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

router.route("/metamask")
  .post(isLoggedIn, [
    body("metamask").trim().escape()
  ], metamaskValidation)

export default router