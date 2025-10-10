import BookItem from "@/components/book-item";
import style from "./page.module.css";
import { BookData } from "@/types";
import { Suspense } from "react";
import BookItemSkeleton from "@/components/skeleton/book-item-skeleton";
import BookListItem from "@/components/skeleton/book-list-skeleton";
import { Metadata } from "next";

//  export const dynamic =  ''
// 특정 페이지의 유형을 강제로 static 혹은 dynamic 페이지로 설정
// 1. auto 2.force-dynamic 3.force-static 4.error

async function AllBooks() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    { cache: "force-cache" }
  );
  if (!response.ok) {
    return <div>Error....</div>;
  }
  const allBooks: BookData[] = await response.json();

  return (
    <div>
      {allBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

async function RecoBooks() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`,
    { next: { revalidate: 3 } }
  );
  if (!response.ok) {
    return <div>Error....</div>;
  }
  const recooBooks: BookData[] = await response.json();

  return (
    <div>
      {recooBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "10012",
  description: "10012에서 등록된 도서를 만나보세요",
  openGraph: {
    title: "10012",
    description: "10012에서 등록된 도서를 만나보세요",
    images: ["/thumbnail.png"],
  },
};

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <Suspense fallback={<BookListItem count={3} />}>
          <RecoBooks />
        </Suspense>
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <Suspense fallback={<BookListItem count={10} />}>
          <AllBooks />
        </Suspense>
      </section>
    </div>
  );
}
