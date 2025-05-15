// 📁 Gallery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('/api/photos', { withCredentials: true });
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this photo?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/photos/${id}`, { withCredentials: true });
      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch (error) {
      alert('Failed to delete photo');
    }
  };

  const filteredPhotos = photos.filter(photo =>
    photo.photo_url && photo.photo_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f3f4f6' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', color: '#4f46e5', marginBottom: '1rem' }}>
        📸 Photo Gallery App
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => navigate('/upload')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          📤 Upload New Photo
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Search your photos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px',
            width: '80%',
            maxWidth: '400px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {filteredPhotos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No photos found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {filteredPhotos.map(photo => (
            <div key={photo.id} style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <img
                src={photo.photo_url}
                alt={photo.photo_url}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <p style={{ fontSize: '0.85rem', color: '#374151', marginTop: '8px' }}>
                {photo.photo_url.split('/').pop()}
              </p>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <a
                  href={`/api/download/${photo.photo_url.split('/').pop()}`}
                  download
                  style={{ textDecoration: 'none', color: '#2563eb' }}
                >
                  ⬇️ Download
                </a>
                <button
                  onClick={() => handleDelete(photo.id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
