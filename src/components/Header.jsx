import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext";

export default function Header(){
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUser(); // ← swap here
  console.log("isAuthenticated:", isAuthenticated); 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="container-fluid">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to={isAuthenticated ? "/dashboard" : "/"}>
              <img src="/images/logo.png" alt="Logo" />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav ms-auto navbar-icons">
                {!isAuthenticated && (
                  <>
                    <Link className="nav-link" to="/register">Register</Link>
                    <Link className="nav-link" to="/">Login</Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    {/*<a className="nav-link" href="#"><i className="bi bi-moon"></i></a>
                    <a className="nav-link" href="#"><i className="bi bi-bell"></i></a>
                    <a className="nav-link acc-profile-icon" href="#"><i className="bi bi-person-circle"></i></a>*/}
                    <button onClick={handleLogout} className="nav-link">Logout</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}