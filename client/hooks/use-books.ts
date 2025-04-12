"use client"

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { booksApi } from "@/lib/api"
import type { Book } from "@/lib/types"

export function useBooks() {
  const queryClient = useQueryClient()

 
  const getRecentBooks= () => {
    return useQuery({
      queryKey: ["recent-books"],
      queryFn: () => booksApi.getRecentBooks(),
    })
  }


  const getBookByIdQuery = (id: number) => {
    return useQuery({
      queryKey: ["book", id],
      queryFn: () => booksApi.getBookById(id),
      enabled: !!id,
    })
  }


  const addBookMutation = useMutation({
    mutationFn: (bookData:FormData) => booksApi.addBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-books"] })
      queryClient.invalidateQueries({ queryKey: ["infinite-mybooks"] })
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] })
    },
  })


  const updateBookMutation = useMutation({
    mutationFn: ({
      id,
      bookData,
    }: {
      id: number
      bookData:FormData
    }) => booksApi.updateBook(id, bookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["infinite-books"] })
      queryClient.invalidateQueries({ queryKey: ["infinite-mybooks"] })
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["book", variables.id] })
    },
  })


  const deleteBookMutation = useMutation({
    mutationFn: (id: number) => booksApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-books"] })
      queryClient.invalidateQueries({ queryKey: ["infinite-mybooks"] })
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] })
    },
  })


  const toggleBookStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: Book["status"]
    }) => booksApi.toggleBookStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["infinite-books"] })
      queryClient.invalidateQueries({ queryKey: ["infinite-mybooks"] })
      queryClient.invalidateQueries({ queryKey: ["userDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["book", variables.id] })
    },
  })



  const getInfiniteBooks = (initialBooks: Book[] = [], pageSize: number = 8,title:string,genre:string,city:string,status:string) => {
    const fetchBooks = async ({ pageParam = 0 }) => {
      return booksApi.getAllBooks({ page: pageParam, limit: pageSize, title, genre, city, status })
    }

    return useInfiniteQuery({
      queryKey: ["infinite-books"],
      queryFn: fetchBooks,
      initialPageParam: 0,
      initialData: initialBooks.length > 0 ? {
        pages: [{ books: initialBooks, success: true, total: initialBooks.length, page: 0, limit: pageSize }],
        pageParams: [0],
      } : undefined,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.books.length < pageSize ? undefined : pages.length
      },
    })
  }


  const getInfiniteMyBooks = (initialBooks: Book[] = [], pageSize: number = 8,title:string,genre:string,city:string,status:string) => {
    const fetchBooks = async ({ pageParam = 0 }) => {
      return booksApi.getAllMyBooks({ page: pageParam, limit: pageSize, title, genre, city, status })
    }

    return useInfiniteQuery({
      queryKey: ["infinite-mybooks"],
      queryFn: fetchBooks,
      initialPageParam: 0,
      initialData: initialBooks.length > 0 ? {
        pages: [{ books: initialBooks, success: true, total: initialBooks.length, page: 0, limit: pageSize }],
        pageParams: [0],
      } : undefined,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.books.length < pageSize ? undefined : pages.length
      },
    })
  }



  return {
    getRecentBooks: () => getRecentBooks(),
    getBookById: (id: number) => getBookByIdQuery(id),
    addBook: () => addBookMutation,
    updateBook: () => updateBookMutation,
    deleteBook: () => deleteBookMutation,
    toggleBookStatus: () => toggleBookStatusMutation,
    getInfiniteBooks: (initialBooks: Book[], pageSize: number,title: string,genre: string, city: string,status:string) => getInfiniteBooks(initialBooks, pageSize, title, genre, city, status),
    getInfiniteMyBooks: (initialBooks: Book[], pageSize: number,title: string,genre: string, city: string,status:string) => getInfiniteMyBooks(initialBooks, pageSize, title, genre, city, status),
  }
}
