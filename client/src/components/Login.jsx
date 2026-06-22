import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = React.useState("login"); // login | register
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");

  const [showOtp, setShowOtp] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  /* --------------------------------------------------
     SUBMIT HANDLER
  -------------------------------------------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🟢 REGISTER (no OTP)
      if (state === "register") {
        const { data } = await axios.post("/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success("Account created. Please login.");
          setState("login");
        } else {
          toast.error(data.message);
        }
      }

      // 🟢 LOGIN STEP 1 → SEND OTP
      if (state === "login" && !showOtp) {
        const { data } = await axios.post("/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          toast.success("OTP sent to your email");
          setShowOtp(true);
        } else {
          toast.error(data.message);
        }
      }

      // 🟢 LOGIN STEP 2 → VERIFY OTP
      if (state === "login" && showOtp) {
        const { data } = await axios.post("/api/user/verify-otp", {
          email,
          otp,
        });

        if (data.success) {
          toast.success("Login successful");
          setUser(data.user);
          navigate("/");
          setShowUserLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* REGISTER NAME */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        {/* PASSWORD */}
        {!showOtp && (
          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
          </div>
        )}

        {/* OTP INPUT */}
        {showOtp && (
          <div className="w-full">
            <p>OTP</p>
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              placeholder="Enter OTP"
              required
            />
          </div>
        )}

        {/* SWITCH LOGIN / REGISTER */}
        {!showOtp && (
          <>
            {state === "register" ? (
              <p>
                Already have account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-primary cursor-pointer"
                >
                  click here
                </span>
              </p>
            ) : (
              <p>
                Create an account?{" "}
                <span
                  onClick={() => setState("register")}
                  className="text-primary cursor-pointer"
                >
                  click here
                </span>
              </p>
            )}
          </>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {loading
            ? "Please wait..."
            : state === "register"
            ? "Create Account"
            : showOtp
            ? "Verify OTP"
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
