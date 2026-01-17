import React from "react";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";

const Navigation = () => {
  return (
    <header className="py-4 px-6 bg-white shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-primary">
          <Link to="/">Quanturs</Link>
        </div>
        <div className="flex items-center gap-6">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
          </ul>
          <UserMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
