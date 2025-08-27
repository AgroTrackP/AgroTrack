import Carousel from "@/components/layout/carrusel/carousel";
import SuscriptionList from "./components/suscription-list";
import AboutMe from "@/components/sections/abotme";
import HeroImage from "@/components/heroimage";
import FloatingChatBot from "@/components/layout/chatbot/FloatingChatBot";
import InformationHome from "@/components/sections/informacion";
import DescriptionHome from "@/components/sections/description";

export default function Home() {
  return (
    <>
      <Carousel/>
      <AboutMe/>
      <InformationHome/>
      <SuscriptionList/>
      <DescriptionHome/>
      <FloatingChatBot />
      <HeroImage/>
    </>
  )
}
