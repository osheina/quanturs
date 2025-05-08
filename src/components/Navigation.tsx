
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <header className="py-4 px-6 bg-white shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-primary">
          <Link to="/">Quanturs</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/vr-experiences" className="hover:text-primary transition-colors">
              VR Experiences
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
