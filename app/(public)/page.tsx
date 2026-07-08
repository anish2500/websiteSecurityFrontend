import Header from "./_components/Header";
import Body from "./_components/body";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Body />
      </main>
      <Footer />
    </>
  );
}
