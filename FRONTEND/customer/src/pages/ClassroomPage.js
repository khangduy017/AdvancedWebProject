import Classroom from "../components/Classroom/Classroom";
import { Toaster } from "react-hot-toast";

const ClassroomPage = () => {
  return (
    <div>
      <Classroom />;
      <Toaster position="top-right" />
    </div>
  );
};

export default ClassroomPage;
