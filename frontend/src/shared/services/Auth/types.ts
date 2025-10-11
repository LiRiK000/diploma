export interface RegisterFormValues {
  email: string
  password: string
  passwordConfirm: string
  name: string
  surname: string
}

export interface RegisterRequestData {
  email: string
  password: string
  name: string
  surname: string
}

export interface LoginFormValues {
  email: string
  password: string
}
