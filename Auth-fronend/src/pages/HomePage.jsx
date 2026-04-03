import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-blue-600">Auth System</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              A modern authentication system built with React and Tailwind CSS. 
              Secure, scalable, and easy to integrate.
            </p>
          </div>
          
          <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto mt-4 sm:mt-0">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-3xl font-bold mb-2">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">
                JWT-based authentication with refresh tokens for enhanced security
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-3xl font-bold mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast</h3>
              <p className="text-gray-600 text-sm">
                Built with React and optimized for performance and user experience
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-3xl font-bold mb-2">🎨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern</h3>
              <p className="text-gray-600 text-sm">
                Clean, responsive design using Tailwind CSS and modern React patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
