import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import supabase from '../config/supabase_client'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Please fill in all fields')
      setMessageType('error')
      return
    }

    if (formData.fullName.trim().length < 2) {
      setMessage('Full name must be at least 2 characters')
      setMessageType('error')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address')
      setMessageType('error')
      return
    }

    // Password validation
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters')
      setMessageType('error')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }

    setLoading(true)

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      })

      if (error) {
        setMessage(error.message)
        setMessageType('error')
        return
      }

      setMessage('Account created successfully! Check your email to confirm your account.')
      setMessageType('success')

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setMessage('Signup failed: ' + err.message)
      setMessageType('error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: '#7f8c8d' }}>Join us to start sharing your articles</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />
            <small style={{ color: '#7f8c8d', display: 'block', marginTop: '0.25rem' }}>
              Password must be at least 6 characters long
            </small>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
            />
          </div>

          {/* Terms */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              id="terms"
              required
              style={{ width: 'auto', marginRight: '0.5rem', marginTop: '0.25rem' }}
            />
            <label htmlFor="terms" style={{ margin: 0, fontSize: '0.9rem' }}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #ecf0f1', paddingTop: '1.5rem' }}>
          <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Already have an account?</p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ width: '100%' }}>
              Sign In Instead
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
