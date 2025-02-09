import React from 'react';
import App from './App';
import './Home.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
};

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>FreshLens</h1>
        <p>A fresh perspective on meal planning</p>
      </header>
            <Navbar />
            <App />
      <footer>
        <p>&copy; 2025 My Homepage</p>
      </footer>
    </div>
  );
}

export default Home;
