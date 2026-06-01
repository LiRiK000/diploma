export interface TourContextType {
  startTour: () => void
  stopTour: () => void
  isTourRunning: boolean
}

export interface TourProviderProps {
  children: React.ReactNode
}
