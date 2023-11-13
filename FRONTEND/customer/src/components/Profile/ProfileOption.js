import "./ProfileOption.css";
import User from "../../assests/img/user.jpg";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const ProfileOption = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-option-container">
      <div className="ava-content-container">
        <img src={User} className="img-option" />
        <div className="content-option">
          <div className="username-option">giahuy200202</div>
          <div className="role-option">user</div>
        </div>
      </div>
      <div className="line-content-container"></div>
      <Button
        onClick={() => {
          navigate("/edit-profile");
        }}
        className="edit-profile-option"
        type="submit"
      >
        General
      </Button>
      <Button
        onClick={() => {
          navigate("/edit-profile");
        }}
        className="edit-profile-option"
        type="submit"
      >
        Edit Profile
      </Button>
      <Button
        onClick={() => {
          navigate("/edit-profile");
        }}
        className="edit-profile-option"
        type="submit"
      >
        Change Password
      </Button>
    </div>
  );
};

export default ProfileOption;
