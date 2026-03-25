import { Dayjs } from 'dayjs'

export type AuthorFormValues = {
  firstName: string
  lastName: string
  dateOfBirth: Dayjs
  dateOfDeath?: Dayjs
}
