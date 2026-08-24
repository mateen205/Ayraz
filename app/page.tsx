import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Featured from "./components/Featured";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main>
        <section className="min-h-screen">
          <Hero />
        </section>

        <section
          id="drops"
          className="scroll-mt-24 min-h-screen"
        >
          <Featured />
        </section>

        <section
          id="about"
          className="scroll-mt-24 min-h-screen"
        >
          <About />
        </section>
      </main>

      <Footer />
    </div>
  );
}