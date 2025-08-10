import Carousel from "@/components/layout/carrusel/carousel";
import SuscriptionList from "./components/suscription-list";
import AboutMe from "@/components/sections/abotme";
import HeroImage from "@/components/heroimage";

export default function Home() {
  return (
    <>
      <Carousel/>
      <AboutMe/>
      <SuscriptionList/>
      <HeroImage/>
    </>
  )
}
