import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://book-review-server-six.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
