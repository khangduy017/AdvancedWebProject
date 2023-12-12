import AdminPageContent from "../components/Admin/AdminPageContent";
import { Toaster } from "react-hot-toast";

const AdminPage = () => {
  return (
    <div>
      <AdminPageContent />;
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminPage;
