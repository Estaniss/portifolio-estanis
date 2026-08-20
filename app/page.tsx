import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { Experience } from "@/components/site/Experience";
import { Projects } from "@/components/site/Projects";
import { IaMatch } from "@/components/site/IaMatch";
import { Contact } from "@/components/site/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <IaMatch />
      <Contact />
    </>
  );
}
