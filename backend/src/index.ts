import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { setupSwagger } from './lib/swagger'
import { authRouter } from './routes/auth.routes'
import { genresRouter } from './routes/genres.routes'
import { errorHandler } from './middleware/error.middleware'
import { authorsRouter } from './routes/author.routes'
import { booksRouter } from './routes/book.routes'
import { cartRouter } from './routes/cart.routes'
import { booksSearchRouter } from './routes/book-search.routes'
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

setupSwagger(app)

app.use(errorHandler)

app.use('/api/auth', authRouter)
app.use('/api/genres', genresRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/books', booksRouter)
app.use('/api/cart', cartRouter)
app.use('/api/search', booksSearchRouter)
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`,
  )
})
