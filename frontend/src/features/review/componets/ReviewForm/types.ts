export interface ReviewFormData {
  content: string
}

export interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void
  isLoading?: boolean
}
