import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useReview = () => {
  const axiosPublic = useAxiosPublic();

  const { data: reviews = [], refetch: reviewRefetch } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews");
      return res.data.data;
    },
  });
  return [reviews, reviewRefetch];
};

export default useReview;
