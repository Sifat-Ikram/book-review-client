import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import img from "../../../assets/sign/authentication.gif";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const { createUser, googleRegister } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check localStorage for saved email and password
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail && savedPassword) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleRegister = () => {
    googleRegister()
      .then((res) => {
        console.log(res);
        const userInfo = {
          email: res.user?.email,
          name: res.user?.displayName,
        };
        axiosPublic.post("/user", userInfo).then((res) => {
          console.log(res.data);
          toast.success("You signed up successfully!");
          navigate(location?.state ? location.state : "/");
        });
      })
      .catch((err) => console.error(err.message));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await createUser(data.email, data.password);

      await updateProfile(res.user, {
        displayName: data.name,
      });

      const userInfo = {
        username: data.name || "",
        email: data.email || "",
      };

      const response = await axiosPublic.post("/user", userInfo);

      if (response.status === 409) {
        toast.error("User with this email already exists.");
      } else if (response.status === 201 && response.data) {
        // Successful creation, check if data is returned
        toast.success("You signed up successfully!");
        navigate(location?.state ? location.state : "/");
      } else {
        toast.error("Your sign-up failed!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen py-8">
      <ToastContainer />
      <div className="flex items-center flex-col lg:flex-row lg:gap-10 gap-8">
        <div className="flex-1">
          <img
            src={img}
            className="w-full h-auto mx-auto lg:mx-0"
            alt="Authentication illustration"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-5 px-8 py-4 md:py-7 lg:py-10 w-full max-w-xl md:shadow-xl bg-white rounded-lg">
          <div className="text-center mb-1 lg:mb-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#04734C] tracking-tight leading-tight mb-1">
              Join Us Today!
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Register to explore amazing features
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-gray-700">Full Name</span>
              </label>
              <input
                name="name"
                {...register("name")}
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered w-full border-[#04734C] focus:ring-[#04734C] focus:border-[#04734C]"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-gray-700">Email</span>
              </label>
              <input
                name="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="input input-bordered w-full border-[#04734C] focus:ring-[#04734C] focus:border-[#04734C]"
                required
              />
            </div>
            <div className="relative">
              <label className="label">
                <span className="label-text text-gray-700">Password</span>
              </label>
              <input
                name="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full border-[#04734C] focus:ring-[#04734C] focus:border-[#04734C]"
              />
              <div
                className="absolute right-3 bottom-3 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="checkbox border-[#04734C] focus:ring-[#04734C]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#045E40] to-[#04734C] hover:from-[#04734C] hover:to-[#045E40] text-white font-semibold text-lg py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
              >
                {loading ? "Registration is on process..." : "Register"}
              </button>
            </div>
            <div className="text-center">
              <h1>
                Already have an account?{" "}
                <a className="text-[#04734C] hover:underline" href="/login">
                  Login
                </a>{" "}
                here
              </h1>
              {error && <p className="text-red-600">{error}</p>}
            </div>
          </form>
          <div className="w-full">
            <button
              onClick={handleGoogleRegister}
              className="w-full flex justify-center items-center gap-3 bg-white border border-[#04734C] text-[#04734C] font-semibold py-3 rounded-lg shadow-md hover:bg-[#04734C] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <FaGoogle className="mr-2" /> Register with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
