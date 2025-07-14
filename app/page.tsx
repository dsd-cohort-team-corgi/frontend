import Card from "@/components/Card";
import HelloWorld from "@/components/HelloWorld";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <HelloWorld />
      <section>
        <h1> What service do you need? </h1>
        <p> Choose from our most popular home services </p>
        <section className="grid">
          <Card />
        </section>
      </section>
    </div>
  );
}
