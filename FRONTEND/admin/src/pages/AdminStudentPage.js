import AdminStudentPageContent from "../components/Admin/AdminStudentPageContent";
import { Toaster } from "react-hot-toast";

const AdminStudentPage = () => {
  return (
    <div>
      <AdminStudentPageContent />;
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminStudentPage;
