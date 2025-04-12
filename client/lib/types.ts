export interface User {
  name: string
  email: string
  password: string
  mobile: string
  role: "owner" | "seeker"
}

export interface Book {
  $loki?: number
  title: string
  author: string
  genre?: string
  city: string
  contact: string
  imgCover: string
  ownerId: number
  status: "available" | "rented" | "exchanged"
  coverImage?: string
}
