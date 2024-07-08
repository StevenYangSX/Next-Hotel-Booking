import FeaturedRoom from "@/components/FeaturedRoom/FeaturedRoom";
import HeroSection from "@/components/HeroSection/HeroSection";
import PageSearch from "@/components/PageSearch/PageSearch";
import { getFeaturedRoom } from "@/libs/apis";
import Gallery from "@/components/Gallery/Gallery";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
const Home = async () => {
  const featuredRoom = await getFeaturedRoom();
  console.log(featuredRoom);

  return (
    <>
      <HeroSection />
      <PageSearch />
      <FeaturedRoom featuredRoom={featuredRoom} />
      <Gallery />
      <NewsLetter />
    </>
  );
};
export default Home;
