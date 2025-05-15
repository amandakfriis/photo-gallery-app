// 📁 Upload.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!image) return alert('Please select an image.');

    const formData = new FormData();
    formData.append('photo', image);

    try {
      await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('Upload successful!');
      navigate('/gallery');
    } catch (err) {
      alert('Upload failed.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>📤 Upload Photo</h2>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>
      <br /><br />
      <button onClick={() => navigate('/gallery')}>Go to Gallery</button>
    </div>
  );
}

export default Upload;