import { useNavigate } from "react-router";

const Account = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Account Page</h1>
      <button
        onClick={() => {
          props.logout();
          navigate("/");
        }}
      >
        logout
      </button>
    </>
  );
};

export default Account;
