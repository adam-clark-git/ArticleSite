import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      // Replace with your actual API endpoint
      // const response = await fetch('/api/articles')
      // const data = await response.json()
      // setArticles(data)
      
      // For now, load from localStorage
      const stored = localStorage.getItem('articles')
      if (stored) {
        setArticles(JSON.parse(stored))
      }
    } catch (err) {
      setError('Failed to load articles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const updated = articles.filter(article => article.id !== id)
      setArticles(updated)
      localStorage.setItem('articles', JSON.stringify(updated))
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem', color: '#2c3e50' }}>All Articles</h2>

      {error && <div className="message error">{error}</div>}

      {articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No articles yet</h3>
          <p>Create your first article to get started!</p>
          <Link to="/create">
            <button className="btn-primary" style={{ marginTop: '1rem' }}>
              Create Article
            </button>
          </Link>
        </div>
      ) : (
        <div className="articles-list">
          {articles.map(article => (
            <div key={article.id} className="article-card">
              <div className="article-card-header">
                <h3>{article.category || 'Uncategorized'}</h3>
              </div>
              <div className="article-card-body">
                <div className="article-card-title">{article.title}</div>
                <div className="article-card-meta">
                  By {article.author} • {new Date(article.date).toLocaleDateString()}
                </div>
                <div className="article-card-excerpt">{article.content}</div>
                <div className="article-card-actions">
                  <Link to={`/${article.id}`} style={{ flex: 1 }}>
                    <button className="btn-primary" style={{ width: '100%' }}>
                      Edit
                    </button>
                  </Link>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
