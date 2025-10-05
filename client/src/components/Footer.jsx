import React from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiPackage,
  FiShield,
  FiTruck,
  FiHeadphones,
  FiHeart,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Today's Deals", href: "/todays-deal" },
    { name: "Compare Products", href: "/compare" },
  ];

  const categories = [
    { name: "Electronics", href: "/category/electronics" },
    { name: "Home Appliances", href: "/category/home-appliances" },
    { name: "Kitchen Appliances", href: "/category/kitchen-appliances" },
    { name: "Audio & Video", href: "/category/audio-video" },
    { name: "Smart Home", href: "/category/smart-home" },
  ];

  const customerService = [
    { name: "Contact Us", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "FAQ", href: "/faq" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: FiFacebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: FiTwitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: FiInstagram, href: "#", color: "hover:text-pink-600" },
    { name: "LinkedIn", icon: FiLinkedin, href: "#", color: "hover:text-blue-700" },
  ];

  const features = [
    {
      icon: FiTruck,
      title: "Free Shipping",
      description: "On orders over $99"
    },
    {
      icon: FiShield,
      title: "Secure Payment",
      description: "100% protected"
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      description: "Dedicated support"
    },
    {
      icon: FiPackage,
      title: "Easy Returns",
      description: "30-day returns"
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Features Section */}
      <div className="border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiPackage className="text-white text-sm" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Market
                    </span>
                    <span className="text-gray-800">Match</span>
                  </h1>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 max-w-md leading-relaxed">
                Your trusted marketplace for comparing products and finding the best deals from verified vendors worldwide.
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <FiMapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>123 Business St, New York, NY 10001</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <FiPhone className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <FiMail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>support@marketmatch.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3 pt-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-8 h-8 bg-gray-100 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-lg flex items-center justify-center text-gray-600 ${social.color} transition-all duration-200`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <a
                      href={category.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                {customerService.map((service) => (
                  <li key={service.name}>
                    <a
                      href={service.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 text-sm">
                © {currentYear} MarketMatch. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>Made with</span>
                <FiHeart className="w-3 h-3 text-red-500" />
                <span>by our team</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <a
                href="/privacy"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Cookies
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">We Accept:</span>
              <div className="flex items-center space-x-1">
                {['💳', '🏦', '💰', '🔒'].map((emoji, index) => (
                  <div
                    key={index}
                    className="w-6 h-4 bg-gray-100 rounded flex items-center justify-center text-xs"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-200 z-50 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;