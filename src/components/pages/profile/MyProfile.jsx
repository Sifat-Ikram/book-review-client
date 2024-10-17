import { useParams } from "react-router-dom";
import useReview from "../../hooks/useReview";
import useUser from "../../hooks/useUser";
import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyProfile = () => {
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const [reviews, reviewRefetch] = useReview();
  const [users, userRefetch] = useUser();
  const currentUser = users?.find((user) => user.email === id);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ username: "", email: "" });
  const [updatedReview, setUpdatedReview] = useState({
    bookName: "",
    reviewText: "",
    rating: 0,
  });

  if (!currentUser) {
    return <h1 className="text-center text-3xl font-semibold">Loading...</h1>;
  }

  // Filter reviews belonging to the current user
  const userReviews = reviews.filter(
    (review) => review.email === currentUser.userEmail
  );

  // Handle profile editing
  const handleEditProfile = () => {
    setEditingProfile(true);
    setUpdatedUser({
      username: currentUser.username,
      email: currentUser.email,
      _id: currentUser._id,
    });
  };

  const handleSaveProfile = async (id) => {
    const updateInfo = {
      name: updatedUser.username,
      email: updatedUser.email,
    };

    await axiosPublic
      .patch(`/user/${id}`, updateInfo)
      .then((res) => {
        console.log(res);
        toast.success("User updated!");
        userRefetch();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle review editing
  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setUpdatedReview({
      bookName: review.bookName,
      reviewText: review.reviewText,
      rating: review.rating,
    });
  };

  const handleSaveReview = async (reviewId) => {
    console.log(reviewId);

    const updatedReviewData = {
      bookName: updatedReview.bookName,
      reviewText: updatedReview.reviewText,
      rating: updatedReview.rating,
    };

    // Optimistic UI update (immediate reflection in UI)
    const updatedReviews = reviews.map((review) =>
      review._id === reviewId ? { ...review, ...updatedReviewData } : review
    );
    // Update the local state immediately to show changes
    reviewRefetch(); // You can remove this if you're using local updates

    // Now send the API request
    try {
      const res = await axiosPublic.patch(
        `/reviews/${reviewId}`,
        updatedReviewData
      );
      console.log(res);
      toast.success("Review updated!");
      // Optionally re-fetch the reviews again here (depending on your state management)
      reviewRefetch();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="text-center my-8">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Welcome,{" "}
          <span className="font-bold text-[#04734C]">
            {currentUser.username}
          </span>
        </h1>
        <p className="text-lg text-gray-500">Email: {currentUser.email}</p>
        <button
          className="bg-gradient-to-r from-[#045E40] to-[#04734C] hover:from-[#04734C] hover:to-[#045E40] text-white font-semibold text-lg px-6 mt-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>

        {/* Edit Profile Form */}
        {editingProfile && (
          <div className="mt-4 bg-gray-100 p-4 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Username:</label>
              <input
                type="text"
                value={updatedUser.username}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, username: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              className="bg-gradient-to-r from-[#045E40] to-[#04734C] hover:from-[#04734C] hover:to-[#045E40] text-white font-semibold text-lg px-6 mt-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
              onClick={() => handleSaveProfile(updatedUser._id)}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* User's Book Reviews Section */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Your Book Reviews
          </h2>
          {userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <div
                  key={review._id}
                  className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  {editingReview === review._id ? (
                    // Edit Review Form
                    <div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Book Name:
                        </label>
                        <input
                          type="text"
                          value={updatedReview.bookName}
                          onChange={(e) =>
                            setUpdatedReview({
                              ...updatedReview,
                              bookName: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Review Text:
                        </label>
                        <textarea
                          value={updatedReview.reviewText}
                          onChange={(e) =>
                            setUpdatedReview({
                              ...updatedReview,
                              reviewText: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Rating:</label>
                        <input
                          type="number"
                          value={updatedReview.rating}
                          onChange={(e) =>
                            setUpdatedReview({
                              ...updatedReview,
                              rating: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          min="1"
                          max="5"
                        />
                      </div>
                      <button
                        className="bg-gradient-to-r from-[#045E40] to-[#04734C] hover:from-[#04734C] hover:to-[#045E40] text-white font-semibold text-lg px-6 mt-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
                        onClick={() => handleSaveReview(review._id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    // Display Review
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-[#04734C]">
                          {review.bookName}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {new Date(review?.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-600 mb-2">By {review.author}</p>
                      <p className="text-gray-700">{review.reviewText}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-yellow-500">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {Array.from({ length: 5 - review.rating }, (_, i) => (
                            <span key={i} className="text-gray-400">
                              ★
                            </span>
                          ))}
                        </span>
                        <button
                          className="bg-gradient-to-r from-[#045E40] to-[#04734C] hover:from-[#04734C] hover:to-[#045E40] text-white font-semibold text-lg px-6 mt-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
                          onClick={() => handleEditReview(review)}
                        >
                          Edit Review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You haven't written any reviews yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
