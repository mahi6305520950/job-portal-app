import React from "react";
import { Facebook, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/5 bg-[#0f0f0f] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-semibold text-white">JobPortal</h2>
          <p className="mt-3 text-sm max-w-xs text-gray-500">
            Discover opportunities, connect with companies, and build your career.
          </p>

          {/* Social icons */}
          <div className="flex gap-4 mt-5 text-gray-500">
            <Facebook className="w-5 h-5 hover:text-white transition" />
            <Twitter className="w-5 h-5 hover:text-white transition" />
            <Linkedin className="w-5 h-5 hover:text-white transition" />
            <Github className="w-5 h-5 hover:text-white transition" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-medium mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <Link to="/jobs"><li className="hover:text-white transition">Jobs</li></Link>
            <Link to="/post-job"><li className="hover:text-white transition">Post a Job</li></Link>
            <Link to="/post-job"><li className="hover:text-white transition">Add Company</li></Link>
            <Link to="/my-jobs"><li className="hover:text-white transition">My Jobs</li></Link>
            <Link to="/saved-jobs"><li className="hover:text-white transition">Saved Jobs</li></Link>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-medium mb-3">Contact</h3>
          <p className="text-sm text-gray-500">Kadapa, India</p>
          <p className="text-sm text-gray-500">support@jobportal.com</p>
          <p className="text-sm text-gray-500">+91 98765 43210</p>
        </div>

      </div>

      <div className="border-t border-white/5 text-center py-5 text-xs text-gray-600">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
