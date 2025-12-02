import React from 'react';
import './AboutUs.css';

function AboutUs() {
  const teamMembers = [
    { name: "John Doe", title: "Founder & CEO" },
    { name: "Jane Smith", title: "Marketing Director" },
    { name: "Mike Johnson", title: "Tech Lead" },
    { name: "Sarah Williams", title: "Customer Support" }
  ];

  return (
    <div className="about-container" id="top">
      <header className="about-header-bg">
        <div className="container about-header-content">
          <i className="about-icon fas fa-store"></i>
          <h1>Our Story</h1>
          <p className="header-subtitle">Building connections between buyers and sellers</p>
        </div>
      </header>

      <div className="container">
        <main className="about-main-content">
          <div className="about-intro text-center">
            <h2 className="main-policy-title">Welcome to Our Marketplace!</h2>
            <p>We are a multi-vendor e-commerce platform connecting sellers and buyers in one seamless experience.</p>
          </div>

          <div className="about-mission-box box-highlight fade-in-up">
            <div className="d-flex align-items-center">
              <i className="fas fa-flag mission-icon me-3"></i>
              <div>
                <h3 className="highlight-title">Our Mission</h3>
                <p className="mb-0">
                  Empower small businesses by providing tools and exposure to grow online.
                </p>
              </div>
            </div>
          </div>

          <div className="about-vision-box box-highlight fade-in-up">
            <div className="d-flex align-items-center">
              <i className="fas fa-eye vision-icon me-3"></i>
              <div>
                <h3 className="highlight-title">Our Vision</h3>
                <p className="mb-0">
                  Become the most trusted, user-friendly online marketplace in the country.
                </p>
              </div>
            </div>
          </div>

          <div className="about-offer-box fade-in-up">
            <h3 className="offer-title">What We Offer</h3>
            <ul className="offer-list">
              <li><i className="fas fa-check-circle me-2"></i> Wide range of trusted products</li>
              <li><i className="fas fa-check-circle me-2"></i> Easy order placement and secure payments</li>
              <li><i className="fas fa-check-circle me-2"></i> Real-time order tracking and support</li>
              <li><i className="fas fa-check-circle me-2"></i> Special deals and discounts</li>
            </ul>
          </div>

          <div className="team-section text-center mt-5">
            <h2 className="team-heading">Meet Our Team</h2>
            <p className="team-subtitle">The passionate people behind our platform</p>
            <div className="row justify-content-center mt-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                  <div className="team-member animated-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="team-circle-img">
                      <i className="fas fa-user-circle team-placeholder"></i> 
                    </div>
                    <h4 className="member-name">{member.name}</h4>
                    <p className="member-title">{member.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="join-journey-box fade-in-up mt-5">
            <i className="fas fa-route join-icon"></i>
            <h3>Join Our Journey</h3>
            <p>Whether customer or seller, we welcome you to our family!</p>
            <button className="btn join-btn-primary">Get Started</button>
          </div>

       {/* Animated Scroll to Top Button (Not visible in the ReturnPolicy component path unless scrolled) */}
                <a href="#" className="scroll-to-top-btn animate__bounceInRight">
                    <i className="fas fa-arrow-up"></i>
                </a>
        </main>
      </div>
    </div>
  );
}

export default AboutUs;
