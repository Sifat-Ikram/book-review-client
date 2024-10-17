import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUser = () => {
  const axiosPublic = useAxiosPublic();

  const { data: users = [], refetch: userRefetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosPublic.get("/user");
      return res.data;
    },
  });
  return [users, userRefetch];
};

export default useUser;
