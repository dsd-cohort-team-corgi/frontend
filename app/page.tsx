import Card from "@/components/Card";
import HelloWorld from "@/components/HelloWorld";
import listOfServices from "@/data/services";

export default function Home() {
  return (
    <div className="h-screen items-center justify-center">
      <HelloWorld />
      <section>
        <h1 className="text-3xl font-bold"> What service do you need? </h1>
        <p font-t> Choose from our most popular home services </p>
        <section className="grid-row-1 sm:grid-row-2 grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3">
          {listOfServices.map((service) => (
            <Card key={service.label} service={service} />
          ))}
        </section>
      </section>
    </div>
  );
}
