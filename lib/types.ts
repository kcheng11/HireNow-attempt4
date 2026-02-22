export interface Skill {
  name: string
  hourlyRate: number
}

export interface Laborer {
  id: string
  name: string
  phone: string
  location: string
  skills: Skill[]
  availability: string[] // days of the week
  photoUrls: string[]
  ratings: Rating[]
  canDrive: boolean
}

export interface Contractor {
  id: string
  name: string
  phone: string
  company: string
  location: string
}

export interface Project {
  id: string
  contractorId: string
  title: string
  description: string
  location: string
  photoUrls: string[] // project space photos
  startDate: string
  endDate: string
  status: "active" | "completed"
}

export interface HireRequest {
  id: string
  projectId: string
  laborerId: string
  contractorId: string
  date: string
  status: "pending" | "accepted" | "declined" | "negotiating" | "completed"
  pickupLocation: string
  dropoffLocation: string
  offeredAmount: number
  counterAmount?: number // laborer's counter-offer
  jobCompleted: boolean
}

export interface Rating {
  contractorId: string
  contractorName: string
  stars: number
  comment: string
  date: string
}

export type Language = "en" | "hi"
export type Role = "laborer" | "contractor"
