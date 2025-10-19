import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaHome,
    FaUser,
    FaShoppingBag,
    FaHeart,
    FaShoppingCart,
    FaCog,
    FaSignOutAlt,
    FaTimes,
    FaBars,
    FaBox,
    FaChartLine,
    FaUsers,
    FaStore,
    FaPlus,
    FaList,
    FaFileInvoice,
    FaMoneyBillWave,
    FaQuestionCircle,
    FaBell
} from 'react-icons/fa';
import './ResponsiveSidebar.css';

const ResponsiveSidebar = ({ isOpen, onClose }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Close sidebar when route changes
    useEffect(() => {
        onClose();
        setActiveMenu(null);
    }, [location, onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    // Common navigation items
    const commonNavItems = [
        { to: '/', label: 'Home', icon: FaHome },
        { to: '/products', label: 'Products', icon: FaShoppingBag },
        { to: '/favorites', label: 'Favorites', icon: FaHeart },
        { to: '/cart', label: 'Cart', icon: FaShoppingCart },
    ];

    // User-specific navigation items
    const userNavItems = [
        { to: '/profile', label: 'Profile', icon: FaUser },
        { to: '/orders', label: 'Orders', icon: FaFileInvoice },
        { to: '/notifications', label: 'Notifications', icon: FaBell },
        { to: '/settings', label: 'Settings', icon: FaCog },
    ];

    // Vendor navigation items
    const vendorNavItems = [
        { to: '/dashboard', label: 'Dashboard', icon: FaChartLine },
        { to: '/dashboard/products', label: 'Products', icon: FaBox },
        { to: '/dashboard/add-product', label: 'Add Product', icon: FaPlus },
        { to: '/dashboard/orders', label: 'Orders', icon: FaFileInvoice },
        { to: '/dashboard/analytics', label: 'Analytics', icon: FaChartLine },
        { to: '/dashboard/customers', label: 'Customers', icon: FaUsers },
    ];

    // Admin navigation items
    const adminNavItems = [
        { to: '/dashboard', label: 'Dashboard', icon: FaChartLine },
        { to: '/dashboard/users', label: 'Users', icon: FaUsers },
        { to: '/dashboard/vendors', label: 'Vendors', icon: FaStore },
        { to: '/dashboard/products', label: 'Products', icon: FaBox },
        { to: '/dashboard/orders', label: 'Orders', icon: FaFileInvoice },
        { to: '/dashboard/analytics', label: 'Analytics', icon: FaChartLine },
        { to: '/dashboard/reports', label: 'Reports', icon: FaFileInvoice },
    ];

    // Support items
    const supportItems = [
        { to: '/help', label: 'Help Center', icon: FaQuestionCircle },
        { to: '/contact', label: 'Contact Us', icon: FaUser },
        { to: '/about', label: 'About', icon: FaQuestionCircle },
    ];

    const getRoleSpecificItems = () => {
        if (!user) return [];

        switch (user.role) {
            case 'vendor':
                return vendorNavItems;
            case 'admin':
                return adminNavItems;
            default:
                return userNavItems;
        }
    };

    const renderNavItems = (items, title = null) => (
        <div className="sidebar-section">
            {title && <h3 className="sidebar-section-title">{title}</h3>}
            <ul className="sidebar-nav-list">
                {items.map((item, index) => (
                    <li key={index}>
                        <Link
                            to={item.to}
                            className={`sidebar-nav-link ${location.pathname === item.to ? 'active' : ''
                                }`}
                            onClick={onClose}
                        >
                            <item.icon className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderCollapsibleSection = (title, items, menuKey) => (
        <div className="sidebar-section">
            <button
                className={`sidebar-section-header ${activeMenu === menuKey ? 'active' : ''}`}
                onClick={() => toggleMenu(menuKey)}
            >
                <h3 className="sidebar-section-title">{title}</h3>
                <span className="section-toggle">
                    {activeMenu === menuKey ? '−' : '+'}
                </span>
            </button>
            {activeMenu === menuKey && (
                <div className="sidebar-section-content">
                    <ul className="sidebar-nav-list">
                        {items.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.to}
                                    className={`sidebar-nav-link ${location.pathname === item.to ? 'active' : ''
                                        }`}
                                    onClick={onClose}
                                >
                                    <item.icon className="nav-icon" />
                                    <span className="nav-label">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}

            {/* Sidebar */}
            <aside className={`responsive-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">🛍️</span>
                        <span className="logo-text">MarketMatch</span>
                    </div>
                    <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
                        <FaTimes />
                    </button>
                </div>

                <div className="sidebar-content">
                    {/* User Info */}
                    {user && (
                        <div className="sidebar-user">
                            <div className="user-avatar">
                                <FaUser />
                            </div>
                            <div className="user-info">
                                <h4 className="user-name">{user.username}</h4>
                                <p className="user-email">{user.email}</p>
                                <span className="user-role">{user.role}</span>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="sidebar-nav">
                        {renderNavItems(commonNavItems, 'General')}

                        {user && renderCollapsibleSection('My Account', getRoleSpecificItems(), 'account')}

                        {renderNavItems(supportItems, 'Support')}
                    </nav>

                    {/* Logout Button */}
                    {user && (
                        <div className="sidebar-footer">
                            <button className="logout-button" onClick={handleLogout}>
                                <FaSignOutAlt className="logout-icon" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default ResponsiveSidebar;
