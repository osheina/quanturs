
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-white/70 backdrop-blur-md shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">EcoTravel</Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/vr-experiences" className="text-gray-700 hover:text-primary transition-colors">VR Experiences</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
