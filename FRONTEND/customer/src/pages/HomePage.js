import HomePageContent from '../components/HomePage/HomePageContent';
import { Toaster } from "react-hot-toast";

const HomePage = () => {
  return <div>
  <HomePageContent />
  <Toaster position="top-right" />
  </div>
};

export default HomePage;
