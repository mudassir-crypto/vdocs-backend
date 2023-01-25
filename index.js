import app from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'

dotenv.config()
connectDB()

const PORT = 4000


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})