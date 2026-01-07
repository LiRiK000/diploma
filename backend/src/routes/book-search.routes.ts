import { Router } from 'express'
import {
  getBookSuggestions,
  searchBooks,
} from '../controller/search.controller'

export const booksSearchRouter = Router()

booksSearchRouter.get('/search', searchBooks)

booksSearchRouter.get('/suggestions', getBookSuggestions)
