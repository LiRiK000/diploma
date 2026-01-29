import { AuthorService } from './AuthorService'
export type { Author, UpsertAuthorPayload } from './AuthorService'

export const authorService = new AuthorService()
