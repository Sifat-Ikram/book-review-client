import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import useBook from "../hooks/useBook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [books] = useBook();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const booksPerPage = 9;

  const handleDetail = (id) => {
    if (user) {
      navigate(`/details/${id}`);
    } else {
      toast.error("You are not logged in. Please log in first");
    }
  };

  const truncateText = (text = "", maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Filter books based on the search query (by title or author)
  const filteredBooks = books.filter((book) => {
    const searchTerm = searchQuery.toLowerCase();
    const title = book.book_title?.toLowerCase() || "";
    const authors = book.author?.toLowerCase() || "";
    return title.includes(searchTerm) || authors.includes(searchTerm);
  });

  // Calculate pagination indices for filtered books
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const selectedBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  // Function to handle pagination clicks
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <ToastContainer />
      <h1 className="text-center text-4xl font-extrabold text-[#04734C] mb-8">
        Our Featured Books Collection
      </h1>
      <p className="text-center text-lg text-gray-800 mb-10">
        Browse through our handpicked collection of books. Whether you love
        fiction, non-fiction, or children's stories, we've got something for
        everyone!
      </p>

      {/* Search Input */}
      <div className="flex flex-col items-center justify-center space-y-5 mb-8">
        <h1 className="text-center text-3xl font-bold">
          Search here
        </h1>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-1/2 text-lg"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedBooks.length > 0 ? (
          selectedBooks.map((book) => (
            <div
              key={book._id}
              className="card bg-white shadow rounded-lg overflow-hidden border-[2px] transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <figure className="relative">
                <img
                  src={book.image}
                  alt={book.book_title || "Book image"}
                  className="w-full h-72 object-cover"
                />
              </figure>
              <div className="card-body p-6 bg-gradient-to-br from-[#f9f9f9] to-[#e0f2e9]">
                <h2 className="text-xl font-bold text-gray-900">
                  {truncateText(book.book_title || "Unknown Title", 25)}{" "}
                </h2>
                <h3 className="text-lg text-gray-700">
                  Authors: {book.author}
                </h3>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => handleDetail(book._id)}
                    className="btn bg-[#04734C] hover:bg-[#035c3d] text-white font-bold py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-700">
            No books found matching your search criteria.
          </p>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-lg text-white font-bold ${
                currentPage === index + 1 ? "bg-[#04734C]" : "bg-gray-400"
              } hover:bg-[#035c3d] transition duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
