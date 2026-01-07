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

export interface MeResponse {
  status: string
  data: {
    user: {
      id: string
      email: string
      name: string
      surname: string
      role: 'LIBRARIAN' | 'USER'
    }
  }
}
