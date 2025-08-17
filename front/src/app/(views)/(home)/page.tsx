import Carousel from "@/components/layout/carrusel/carousel";
import SuscriptionList from "./components/suscription-list";
import AboutMe from "@/components/sections/abotme";
import HeroImage from "@/components/heroimage";
import FloatingChatBot from "@/components/layout/chatbot/FloatingChatBot";

export default function Home() {
  return (
    <>
      <Carousel/>
      <AboutMe/>
      <SuscriptionList/>
      <FloatingChatBot />
      <HeroImage/>
    </>
  )
}
