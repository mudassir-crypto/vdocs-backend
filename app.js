import express from 'express'
import cors from 'cors'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoute.js'

const app = express()

app.use(cors())
app.use(express.json())


app.use('/api/v1', userRoutes)

app.get('/', (req, res) => {
  return res.json({
    message: "API is working"
  })
})

app.use(notFound)
app.use(errorHandler)


export default app