import { useParams } from "react-router-dom";
import useBook from "../../hooks/useBook";
import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useReview from "../../hooks/useReview";

const DetailsPage = () => {
  const { id } = useParams();
  const [books] = useBook();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [reviews, refetch] = useReview();

  const selectedBook = books.find((book) => book._id === id);

  if (!selectedBook) {
    return <h1>Loading....</h1>;
  }

  const { authors, book_title, image, rating: bookRating } = selectedBook;

  const selectedReview = reviews?.filter(
    (review) => review?.bookName === book_title
  );

  if (!selectedReview) {
    return <h1>Loading...</h1>;
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      author: authors,
      reviewText,
      rating,
      username: user?.displayName,
      userEmail: user.email,
      bookName: book_title,
      date: new Date().toISOString(),
    };

    const response = await axiosPublic.post("/review", newReview);

    if (response.data.insertedId) {
      toast.success("Your review is submitted!");
      refetch();
    }

    setReviewText("");
    setRating(0);
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row gap-8 p-6 rounded-lg mb-8">
        <div className="lg:w-1/3">
          <img
            src={image}
            alt={book_title}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="lg:w-2/3 lg:pl-10 mt-6 lg:mt-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {book_title}
          </h1>
          <p className="text-lg text-gray-600 mb-2">Author(s): {authors}</p>
          <div className="flex items-center mb-4">
            <span className="text-lg font-bold">Rating:</span>
            <div className="ml-2 flex">
              {/* Display star ratings */}
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < bookRating ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.97 6.065a1 1 0 00.95.69h6.293c.969 0 1.371 1.24.588 1.81l-5.087 3.699a1 1 0 00-.363 1.118l1.97 6.065c.3.921-.755 1.688-1.54 1.118l-5.087-3.7a1 1 0 00-1.175 0l-5.087 3.7c-.784.57-1.838-.197-1.54-1.118l1.97-6.065a1 1 0 00-.363-1.118L2.44 11.492c-.783-.57-.38-1.81.588-1.81h6.293a1 1 0 00.95-.69l1.97-6.065z"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        {selectedReview.length === 0 ? (
          <p className="text-gray-600">
            No reviews yet. Be the first to leave a review!
          </p>
        ) : (
          <div className="space-y-4">
            {selectedReview.map((review, index) => (
              <div key={index} className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium dark:text-white">
                    {review?.username}
                  </h3>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    {new Date(review?.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-lg">{review.reviewText}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < review.rating ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-yellow-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.97 6.065a1 1 0 00.95.69h6.293c.969 0 1.371 1.24.588 1.81l-5.087 3.699a1 1 0 00-.363 1.118l1.97 6.065c.3.921-.755 1.688-1.54 1.118l-5.087-3.7a1 1 0 00-1.175 0l-5.087 3.7c-.784.57-1.838-.197-1.54-1.118l1.97-6.065a1 1 0 00-.363-1.118L2.44 11.492c-.783-.57-.38-1.81.588-1.81h6.293a1 1 0 00.95-.69l1.97-6.065z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Form */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Add a Review</h3>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
          ></textarea>
          <div className="flex items-center mt-4">
            <span className="mr-2">Rating:</span>
            <select
              className="select select-bordered"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={0}>Select Rating</option>
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>
          <button
            className="bg-gradient-to-r from-[#045E40] to-[#04734C] hover:from-[#04734C] hover:to-[#045E40] text-white font-semibold text-lg px-6 mt-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
            onClick={handleReviewSubmit}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
