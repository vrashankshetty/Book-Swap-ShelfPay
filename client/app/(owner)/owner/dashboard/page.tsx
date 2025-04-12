"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookPlus, BookOpen, Settings, User } from "lucide-react"
import Link from "next/link"
import BookGrid from "@/components/book-grid"
import { useUser } from "@/hooks/use-user"
import Loading from "@/components/loader";
import Error from "@/components/error";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const {data:dashboardData,isLoading,isError} = useUser().getDashoard;


  if (isLoading) {
    return <Loading/>
  }
  if (isError) {
    return <Error message="Something went wrong!"/>
  }


  return (
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your books and profile</p>
        </div>
        <Link href="/owner/books/add">
          <Button>
            <BookPlus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <CardDescription>Books you've added</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.dashboard.totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CardDescription>Books ready to share</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.dashboard.availableBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rented/Exchanged</CardTitle>
            <CardDescription>Books currently shared</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.dashboard.rentedBooks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
         <Card>
              <CardHeader>
                <CardTitle>My Books</CardTitle>
                <CardDescription>Manage the books you've added to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <BookGrid isManageable books={dashboardData.dashboard.myBooks}/>
              </CardContent>
              <CardFooter className="flex justify-center border-t px-6 py-4">
                <Link href="/owner/books">
                  <Button variant="outline">View All My Books</Button>
                </Link>
              </CardFooter>
            </Card>
      </div>
    </div>
  )
}
