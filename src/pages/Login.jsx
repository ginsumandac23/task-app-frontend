import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

export default function Login() {

  const { login } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(form); 
      toast.success("Login successful!");
      navigate("/dashboard"); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">

      <div className="row w-100 justify-content-center">
        <div className="col-5 p-4 text-center rounded-3 auth-container">

          <img src="/images/register-icon.png" alt="login icon" />
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>

          <div className="auth-form text-start p-4 rounded-4 mt-5">

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Email</label>

                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@mail.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>

                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-style-default w-100" disabled={loading}>
                {
                  loading ? (
                      <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Logging in...
                      </>
                    ) : (
                      "Login"
                    )
                }
              </button>

            </form>

            <hr className="auth-divider" />

            <div className="auth-footer-text text-center">
              <p>
                Don't have an account? <Link to="/register">Sign up for free</Link>
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}