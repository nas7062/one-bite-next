import BookItem from "@/components/book-item";
import BookListItem from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";
import { Suspense, use } from "react";

type SearchParams = { q?: string };

async function SearchResult({ q }: { q?: string }) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search`);
  if (q) url.searchParams.set("q", q);

  const response = await fetch(url.toString(), { cache: "force-cache" });
  if (!response.ok) return <div>Error...</div>;

  const books: BookData[] = await response.json();
  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "" } = use(searchParams);

  return (
    <Suspense key={q} fallback={<BookListItem count={3} />}>
      <SearchResult q={q} />
    </Suspense>
  );
}
