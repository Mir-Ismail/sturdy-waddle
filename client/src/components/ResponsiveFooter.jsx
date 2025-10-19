import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaChevronUp
} from 'react-icons/fa';
import './ResponsiveFooter.css';

const ResponsiveFooter = () => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        company: [
            { label: 'About Us', to: '/about' },
            { label: 'Our Story', to: '/about#story' },
            { label: 'Careers', to: '/careers' },
            { label: 'Press', to: '/press' },
            { label: 'Contact Us', to: '/contact' }
        ],
        support: [
            { label: 'Help Center', to: '/help' },
            { label: 'Shipping Info', to: '/shipping' },
            { label: 'Returns', to: '/returns' },
            { label: 'Size Guide', to: '/size-guide' },
            { label: 'Track Order', to: '/track-order' }
        ],
        legal: [
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Cookie Policy', to: '/cookies' },
            { label: 'Refund Policy', to: '/refund-policy' },
            { label: 'Warranty', to: '/warranty' }
        ],
        categories: [
            { label: 'Electronics', to: '/category/electronics' },
            { label: 'Clothing', to: '/category/clothing' },
            { label: 'Home & Garden', to: '/category/home-garden' },
            { label: 'Sports', to: '/category/sports' },
            { label: 'Books', to: '/category/books' }
        ]
    };

    const socialLinks = [
        { icon: FaFacebookF, href: '#', label: 'Facebook' },
        { icon: FaTwitter, href: '#', label: 'Twitter' },
        { icon: FaInstagram, href: '#', label: 'Instagram' },
        { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
        { icon: FaYoutube, href: '#', label: 'YouTube' }
    ];

    const contactInfo = [
        {
            icon: FaMapMarkerAlt,
            label: 'Address',
            value: '123 Business District, Karachi, Pakistan 75500'
        },
        {
            icon: FaPhone,
            label: 'Phone',
            value: '+92 300 1234567'
        },
        {
            icon: FaEnvelope,
            label: 'Email',
            value: 'info@marketmatch.com'
        },
        {
            icon: FaClock,
            label: 'Hours',
            value: 'Mon - Fri: 9AM - 6PM'
        }
    ];

    return (
        <footer className="responsive-footer">
            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-content">
                        {/* Company Info */}
                        <div className="footer-section footer-company">
                            <div className="footer-logo">
                                <Link to="/" className="logo-link">
                                    <span className="logo-icon">🛍️</span>
                                    <span className="logo-text">MarketMatch</span>
                                </Link>
                            </div>
                            <p className="footer-description">
                                Your trusted online marketplace for quality products at competitive prices.
                                We connect customers with verified vendors across Pakistan.
                            </p>

                            {/* Contact Info */}
                            <div className="contact-info">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="contact-item">
                                        <info.icon className="contact-icon" />
                                        <div className="contact-details">
                                            <span className="contact-label">{info.label}</span>
                                            <span className="contact-value">{info.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="social-links">
                                <span className="social-title">Follow Us:</span>
                                <div className="social-icons">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="social-link"
                                            aria-label={social.label}
                                        >
                                            <social.icon />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="footer-links">
                            {/* Company Links */}
                            <div className="footer-section">
                                <h3 className="footer-title">Company</h3>
                                <ul className="footer-link-list">
                                    {footerLinks.company.map((link, index) => (
                                        <li key={index}>
                                            <Link to={link.to} className="footer-link">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Support Links */}
                            <div className="footer-section">
                                <h3 className="footer-title">Support</h3>
                                <ul className="footer-link-list">
                                    {footerLinks.support.map((link, index) => (
                                        <li key={index}>
                                            <Link to={link.to} className="footer-link">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Legal Links */}
                            <div className="footer-section">
                                <h3 className="footer-title">Legal</h3>
                                <ul className="footer-link-list">
                                    {footerLinks.legal.map((link, index) => (
                                        <li key={index}>
                                            <Link to={link.to} className="footer-link">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Categories */}
                            <div className="footer-section">
                                <h3 className="footer-title">Shop</h3>
                                <ul className="footer-link-list">
                                    {footerLinks.categories.map((link, index) => (
                                        <li key={index}>
                                            <Link to={link.to} className="footer-link">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Footer (Collapsible) */}
            <div className="footer-mobile">
                <div className="container">
                    {/* Company Info Mobile */}
                    <div className="mobile-footer-section">
                        <div className="footer-logo">
                            <Link to="/" className="logo-link">
                                <span className="logo-icon">🛍️</span>
                                <span className="logo-text">MarketMatch</span>
                            </Link>
                        </div>
                        <p className="footer-description">
                            Your trusted online marketplace for quality products at competitive prices.
                        </p>
                    </div>

                    {/* Collapsible Sections */}
                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key} className="mobile-footer-section">
                            <button
                                className={`mobile-section-header ${activeSection === key ? 'active' : ''}`}
                                onClick={() => toggleSection(key)}
                            >
                                <span className="section-title">
                                    {key === 'company' && 'Company'}
                                    {key === 'support' && 'Support'}
                                    {key === 'legal' && 'Legal'}
                                    {key === 'categories' && 'Shop'}
                                </span>
                                <span className="section-toggle">
                                    {activeSection === key ? '−' : '+'}
                                </span>
                            </button>
                            {activeSection === key && (
                                <div className="mobile-section-content">
                                    <ul className="mobile-footer-links">
                                        {links.map((link, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={link.to}
                                                    className="mobile-footer-link"
                                                    onClick={() => setActiveSection(null)}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Contact & Social Mobile */}
                    <div className="mobile-footer-section">
                        <h3 className="mobile-section-title">Contact Info</h3>
                        <div className="mobile-contact-info">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="mobile-contact-item">
                                    <info.icon className="mobile-contact-icon" />
                                    <span className="mobile-contact-text">{info.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mobile-footer-section">
                        <h3 className="mobile-section-title">Follow Us</h3>
                        <div className="mobile-social-links">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="mobile-social-link"
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <div className="footer-copyright">
                            <p>&copy; 2024 MarketMatch. All rights reserved.</p>
                            <p className="footer-disclaimer">
                                MarketMatch is committed to providing quality products and excellent customer service.
                            </p>
                        </div>
                        <div className="footer-bottom-links">
                            <Link to="/privacy" className="bottom-link">Privacy</Link>
                            <Link to="/terms" className="bottom-link">Terms</Link>
                            <Link to="/sitemap" className="bottom-link">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                className="back-to-top"
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <FaChevronUp />
            </button>
        </footer>
    );
};

export default ResponsiveFooter;
