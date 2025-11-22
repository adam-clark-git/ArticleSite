import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabase_client'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email || !formData.password) {
      setMessage('Please fill in all fields')
      setMessageType('error')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address')
      setMessageType('error')
      return
    }

    setLoading(true)

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        setMessage(error.message)
        setMessageType('error')
        return
      }

      // Store user session
      if (data.user) {
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          loginTime: new Date().toISOString()
        }))
      }

      setMessage('Login successful! Redirecting...')
      setMessageType('success')

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setMessage('Login failed: ' + err.message)
      setMessageType('error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: '#7f8c8d' }}>Sign in to manage your articles</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="remember"
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            <label htmlFor="remember" style={{ margin: 0 }}>
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Forgot Password */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <a href="#" style={{ color: '#3498db', textDecoration: 'none' }}>
              Forgot your password?
            </a>
          </div>
        </form>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #ecf0f1', paddingTop: '1.5rem' }}>
          <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Don't have an account?</p>
          <button
            onClick={handleSignUp}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
