import "../../../styles/auth/reset-password.css"

const ResetVisual = () => {
  return (
    <div className="forgot-password-visual-wrapper">
      {/* Background */}
      <div className="forgot-password-background"></div>

      {/* Right side visual */}
      <div className="forgot-password-visual-container single-image">
        <div className="image-card">
          <img
            src="/images/image.png"
            alt="Reset password illustration"
            className="reset-visual-image"
          />
        </div>
      </div>
    </div>
  )
}

export default ResetVisual 