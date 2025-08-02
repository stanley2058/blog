import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Main>
      <Navbar />
      {children}
    </Main>
  );
}
