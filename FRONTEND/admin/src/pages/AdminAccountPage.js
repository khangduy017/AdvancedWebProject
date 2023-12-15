import AdminAccountPageContent from "../components/Admin/AdminAccountPageContent";
import { Toaster } from "react-hot-toast";

const AdminAccountPage = () => {
  return (
    <div>
      <AdminAccountPageContent />;
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminAccountPage;
