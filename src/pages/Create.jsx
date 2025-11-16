import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    file: null
  })
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB')
        setMessageType('error')
        return
      }
      setFormData(prev => ({
        ...prev,
        file: file
      }))
      setMessage(null)
    }
  }

  const handleDragDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB')
        setMessageType('error')
        return
      }
      setFormData(prev => ({
        ...prev,
        file: file
      }))
      setMessage(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.author || !formData.content) {
      setMessage('Please fill in all required fields')
      setMessageType('error')
      return
    }

    setUploading(true)

    try {
      // Create article object
      const article = {
        id: Date.now().toString(),
        ...formData,
        fileSize: formData.file ? formData.file.size : null,
        fileName: formData.file ? formData.file.name : null
      }

      // Get existing articles from localStorage
      const existing = localStorage.getItem('articles')
      const articles = existing ? JSON.parse(existing) : []
      
      // Add new article
      articles.push(article)
      
      // Save to localStorage
      localStorage.setItem('articles', JSON.stringify(articles))

      setMessage('Article created successfully!')
      setMessageType('success')

      // Reset form
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setMessage('Failed to create article: ' + err.message)
      setMessageType('error')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create New Article</h2>

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
              value={formData.category}
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

          {/* File Upload */}
          <div className="form-group">
            <label>Attach File (Optional)</label>
            <div
              className="file-upload"
              onDrop={handleDragDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <div className="file-upload-text">
                📁 Drop your file here or click to browse
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#7f8c8d' }}>
                Supported: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
              </div>
              {formData.file && (
                <div className="file-name">
                  ✓ {formData.file.name} ({(formData.file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="btn-group">
            <button
              type="submit"
              className="btn-primary"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  Uploading...
                </>
              ) : (
                'Create Article'
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create
