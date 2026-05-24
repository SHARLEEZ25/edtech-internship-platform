import "../../../styles/auth/forgot-password.css"


const ForgotPasswordVisual = () => {
  return (
    <div className="forgot-password-visual-wrapper">
      {/* Background with gradient */}
      <div className="forgot-password-background"></div>

      {/* Main content */}
      <div className="forgot-password-visual-container">
        {/* Icon cards container */}
        <div className="forgot-password-content">
          {/* Top-left */}
          <div className="icon-card card-1 icon-only">
            <img
              src="public/icons/trending-arrow.png"
              alt="Trending Arrow"
              className="icon-image"
            />
          </div>

          {/* Top-right */}
          <div className="icon-card card-2 icon-only">
            <img
              src="/icons/document.png"
              alt="Document"
              className="icon-image"
            />
          </div>

          {/* Left-center */}
          <div className="icon-card card-3 icon-only">
            <img
              src="/icons/search.png"
              alt="Search"
              className="icon-image small"
            />
          </div>

          {/* Right-center */}
          <div className="icon-card card-4 icon-only">
            <img
              src="/icons/blocks.png"
              alt="Building Blocks"
              className="icon-image small"
            />
          </div>

          {/* Bottom-center */}
          <div className="icon-card card-5 icon-only">
            <img
              src="/icons/badge.png"
              alt="Badge"
              className="icon-image"
            />
          </div>

          {/* Decorative sparkles */}
          <div className="sparkle sparkle-1"></div>
          <div className="sparkle sparkle-2"></div>
          <div className="sparkle sparkle-3"></div>
        </div>

        {/* Bottom text */}
        <div className="forgot-password-text">
          Reset your password and get back on track with your career journey.
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordVisual
