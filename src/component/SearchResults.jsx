import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function SearchResults() {
  const { search } = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://stayfinder-backend-trrx.onrender.com/search${search}`, {
          headers: token
            ? {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = await res.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [search]);

  if (loading) {
    return (
      <div className="p-6 text-center text-blue-600 font-medium">
        Searching listings...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        No listings found for your search.
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing._id} className="border p-4 rounded shadow bg-white">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
          <p className="text-gray-700 mb-1">₹{listing.price} — {listing.location}</p>
          <p className="text-sm text-gray-500">{listing.category}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
