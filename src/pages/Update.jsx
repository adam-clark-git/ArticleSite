import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function Update() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadArticle()
  }, [id])

  const loadArticle = () => {
    try {
      const stored = localStorage.getItem('articles')
      if (stored) {
        const articles = JSON.parse(stored)
        const article = articles.find(a => a.id === id)
        if (article) {
          setFormData(article)
        } else {
          setMessage('Article not found')
          setMessageType('error')
        }
      }
    } catch (err) {
      setMessage('Failed to load article')
      setMessageType('error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.author || !formData.content) {
      setMessage('Please fill in all required fields')
      setMessageType('error')
      return
    }

    setUpdating(true)

    try {
      const stored = localStorage.getItem('articles')
      const articles = JSON.parse(stored)
      
      // Find and update article
      const index = articles.findIndex(a => a.id === id)
      if (index !== -1) {
        articles[index] = formData
        localStorage.setItem('articles', JSON.stringify(articles))
        
        setMessage('Article updated successfully!')
        setMessageType('success')

        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
    } catch (err) {
      setMessage('Failed to update article: ' + err.message)
      setMessageType('error')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3>Article not found</h3>
          <button
            className="btn-primary"
            onClick={() => navigate('/')}
            style={{ marginTop: '1rem' }}
          >
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>Edit Article</h2>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Article Title <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              required
            />
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author">
              Author <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">
              Article Content <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article content here..."
              required
            />
          </div>

          {/* File Info */}
          {formData.fileName && (
            <div className="form-group">
              <label>Attached File</label>
              <div style={{ padding: '0.75rem', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
                📎 {formData.fileName} ({(formData.fileSize / 1024).toFixed(2)} KB)
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="btn-group">
            <button
              type="submit"
              className="btn-primary"
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Update
