import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SecondHeader.css"; // Second Header Styles
import { FaBars, FaTimes, FaTags, FaStore, FaHandHoldingHeart, FaSmile, FaTools, FaLaptop, FaUser, FaChild, FaShoePrints, FaGem, FaRedo, FaBoxOpen, FaBook } from "react-icons/fa";

const SecondHeader = () => {
    const [mobileMenu, setMobileMenu] = useState(false);

    // Map menu names to their corresponding category IDs and routes
    const menuMap = [
        { name: "Home", icon: FaStore, path: "/" },
        { name: "Fashion", icon: FaLaptop, path: "/fashion" },
        { name: "Accessories", icon: FaUser, path: "/accessories" },
        { name: "Cosmetics", icon: FaTags, path: "/cosmetics" },
        { name: "Toys", icon: FaLaptop, path: "/toys" },
        { name: "Stationary", icon: FaShoePrints, path: "/stationary" },
        { name: "Book", icon: FaHandHoldingHeart, path: "/book" },
        { name: "Photoframe", icon: FaGem, path: "/photoframe" },
        { name: "FootWears", icon: FaBoxOpen, path: "/footwears" },
        { name: "Jewellery", icon: FaGem, path: "/jewellery" },
        { name: "Mens", icon: FaChild, path: "/mens" },
        { name: "Kids", icon: FaBook, path: "/kids" },
        { name: "Electronics ", icon: FaBoxOpen, path: "/electronics " },
        { name: "Personal Care", icon: FaRedo, path: "/personal-care" },

    ];
    
    // Select the first 10 items for the visible desktop menu (Teal Bar)
    const desktopMenu = menuMap.slice(0, 14);
    // Use all items for the mobile dropdown
    const mobileDropdown = menuMap;

    const toggleMenu = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <div className="second-header-wrapper">
            <div className="second-header">
                {/* Left Menu Container */}
                <div className="menu-left">
                    {/* "All" button/Mobile Toggle (Visible on Mobile) */}
                    <div className="menu-item all" onClick={toggleMenu}>
                        <FaBars className="menu-icon" /> ALL CATEGORIES
                    </div>

                    {/* Menu List */}
                    {/* Only show the horizontal menu if the mobile menu is NOT active */}
                    <ul className={`menu-list ${mobileMenu ? "active" : ""}`}>
                        {/* Render the appropriate list based on screen size/state */}
                        {(mobileMenu ? mobileDropdown : desktopMenu).map((item, idx) => (
                            <li
                                key={idx}
                                className="menu-item category-link-item"
                                // Close the mobile menu when an item is clicked
                                onClick={mobileMenu ? toggleMenu : undefined}
                            >
                                <Link to={item.path} className="menu-link-custom">
                                    {/* Show icon only for mobile dropdown */}
                                    {mobileMenu && item.icon && <item.icon className="menu-item-mobile-icon" />}
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Close Button for Mobile Menu (Visible when dropdown is open) */}
                {mobileMenu && (
                    <FaTimes className="close-icon" onClick={toggleMenu} />
                )}
            </div>
        </div>
    );
};

export default SecondHeader;