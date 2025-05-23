import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Edit, Trash2 } from 'lucide-react';
import ArticleEditor from '../components/ArticleEditor';
import toast from 'react-hot-toast';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/article/getAllarticle');
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      toast.error('Failed to fetch articles');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.get(`http://localhost:8080/article/deleteArticle/${id}`);
      toast.success('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Article</h1>
        <button
          onClick={() => {
            setSelectedArticle(null);
            setShowEditor(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Article
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by title, category or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Published Date</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id} className="border-b">
                <td className="p-3">{article.title}</td>
                <td className="p-3">{article.categoryName}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="p-3">{new Date(article.publication_date).toLocaleDateString()}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedArticle(article);
                      setShowEditor(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditor && (
        <ArticleEditor
          article={selectedArticle}
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false);
            fetchArticles();
          }}
        />
      )}
    </div>
  );
};

export default Articles;