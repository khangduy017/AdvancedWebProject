import "./HomePageContent.css";
import { RingLoader } from "react-spinners";

const HomePageContent = () => {
  return (
    <div className="spinner">
      <h3>Homepage</h3>
      <RingLoader color="#5D5FEF" size={400} />
    </div>
  );
};

export default HomePageContent;
