import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="text-4xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-white hover:text-black transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
