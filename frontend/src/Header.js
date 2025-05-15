// Header.js
import React from 'react';

function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>📸 Photo Gallery App</h1>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#333',
    padding: '20px 0',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    margin: 0,
    fontSize: '28px'
  }
};

export default Header;
