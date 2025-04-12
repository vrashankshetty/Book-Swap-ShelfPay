import axios, { AxiosError } from "axios"
import type { Book, User } from "./types"
import Cookies from "js-cookie"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

//for normal json data
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})


const formApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const userId = Cookies.get("userId");
    if (userId) {
      config.headers.Authorization = `Bearer ${userId}`
    }
    return config
  },
  (error) => Promise.reject(error),
)


formApi.interceptors.request.use(
  (config) => {
    const userId = Cookies.get("userId");
    if (userId) {
      config.headers.Authorization = `Bearer ${userId}`
    }
    return config
  },
  (error) => Promise.reject(error),
)


// Standard error handler
const handleApiError = (error: unknown, defaultMessage = "An error occurred") => {
  if (error instanceof AxiosError && error.response) {
    return error.response.data || { success: false, message: defaultMessage }
  }
  return { success: false, message: defaultMessage }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      return response.data
    } catch (error) {
      return handleApiError(error, "Login failed")
    }
  },
  register: async (userData: User) => {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      return handleApiError(error, "Registration failed")
    }
  },
  verifyToken: async (id:string) => {
    try {
      const response = await api.post(`/auth/verifyToken/${id}`)
      return response.data
    } catch (error) {
      return handleApiError(error, "Registration failed")
    }
  },
}

// User API
export const userApi = {
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile")
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to fetch profile")
    }
  },
  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await api.put("/users/profile", userData)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to update profile")
    }
  },
  getDashoard: async () => {
    try {
      const response = await api.get("/users/dashboard")
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to fetch dashboard")
    }
  },
}

// Books API
export const booksApi = {  
  getAllBooks: async ({title,city,genre,page,limit,status}:{
    title?: string
    city?: string
    genre?: string
    page?: number
    limit?: number
    status?: string
  }) => {
    try {
      const response = await api.get(`/books?title=${title}&city=${city}&genre=${genre}&limit=${limit}&page=${page}&status=${status}`)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to fetch books")
    }
  },

  getRecentBooks: async () => {
    try {
      const response = await api.get(`/books/recent-books`)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to fetch books")
    }
  },

  getAllMyBooks: async ({title,city,genre,page,limit,status}:{
    title?: string
    city?: string
    genre?: string
    page?: number
    limit?: number
    status?: string
  }) => {
    try {
      const response = await api.get(`/books/me?title=${title}&city=${city}&genre=${genre}&limit=${limit}&page=${page}&status=${status}`)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to fetch books")
    }
  },

  getBookById: async (id: number) => {
    try {
      const response = await api.get(`/books/${id}`)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to fetch book details")
    }
  },
  addBook: async (bookData:FormData) => {
    try {
      const response = await formApi.post("/books/",bookData)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to add book")
    }
  },
  updateBook: async (id: number, bookData: FormData) => {
    try {
      const response = await formApi.put(`/books/${id}`, bookData)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to update book")
    }
  },
  deleteBook: async (id: number) => {
    try {
      const response = await api.delete(`/books/${id}`)
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to delete book")
    }
  },
  toggleBookStatus: async (id: string, status: Book["status"]) => {
    try {
      const response = await api.patch(`/books/${id}/status`, { status })
      return response.data
    } catch (error) {
      return handleApiError(error, "Failed to update book status")
    }
  },
}