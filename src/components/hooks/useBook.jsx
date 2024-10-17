import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useBook = () => {
  const axiosPublic = useAxiosPublic();

  const { data: books = [] } = useQuery({
    queryKey: ["book"],
    queryFn: async () => {
      const res = await axiosPublic.get("/book");
      return res.data.data;
    },
  });
  return [books];
};

export default useBook;
