"use client";

import InfiniteScrollBooks from "@/components/infinite-scroll";

export default function BooksPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <InfiniteScrollBooks isManageable={true}/>
    </div>
  )
}
