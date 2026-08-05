import React from 'react';
import { Link } from 'react-router-dom';
import './css/Portfolio.css';

const Portfolio = () => {

    const projects = [
        { id: 1, title: "Modern Living Room", category: "Interior", img: "/images/image1.jpg", location: "Ludhiana", link: "/living-room" },
        { id: 2, title: "Luxury Bedroom", category: "Interior", img: "/images/image2.jpg", location: "Chandigarh", link: "/bedroom-design" },
        { id: 3, title: "Modular Kitchen", category: "Interior", img: "/images/product-chair.jpg", location: "Ludhiana", link: "/modular-kitchen" },
        { id: 4, title: "Garden Landscape", category: "Exterior", img: "/images/storage.jpg", location: "Amritsar", link: "/garden-landscape" },
        { id: 5, title: "Home Office Design", category: "Commercial", img: "/images/lighting.jpg", location: "Ludhiana", link: "/home-office" },
        { id: 6, title: "Terrace Makeover", category: "Exterior", img: "/images/office-chair.jpg", location: "Chandigarh", link: "/terrace-design" },
        { id: 7, title: "Full Home Renovation", category: "Renovation", img: "/images/accessories.jpg", location: "Ludhiana", link: "/full-renovation" },
        { id: 8, title: "Commercial Design", category: "Commercial", img: "/images/decor-office.jpg", location: "Jalandhar", link: "/commercial-design" },
        { id: 9, title: "Balcony Makeover", category: "Exterior", img: "/images/image1.jpg", location: "Chandigarh", link: "/balcony-makeover" },
        { id: 10, title: "Exterior Elevation", category: "Exterior", img: "/images/storage.jpg", location: "Mohali", link: "/exterior-elevation" },
    ];

    const [filter, setFilter] = React.useState('All');
    const categories = ['All', 'Interior', 'Exterior', 'Commercial', 'Renovation'];
    const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="portfolio-page">

            {/* Hero */}
            <section className="portfolio-hero">
                <p className="page-tag">OUR WORK</p>
                <h1>Projects That <em>Speak For Themselves</em></h1>
                <p>A curated showcase of spaces we've designed, built, and delivered.</p>
            </section>

            {/* Filters */}
            <section className="portfolio-filters-section">
                <div className="portfolio-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <p className="portfolio-count">
                    {filtered.length} {filtered.length === 1 ? 'Project' : 'Projects'}
                    {filter !== 'All' ? ` · ${filter}` : ''}
                </p>
            </section>

            {/* Project List */}
            <section className="portfolio-list">
                {filtered.map((project, index) => (
                    <Link
                        to={project.link}
                        className="portfolio-row"
                        key={project.id}
                    >
                        <span className="portfolio-index">{String(index + 1).padStart(2, '0')}</span>

                        <div className="portfolio-row-img">
                            <img
                                src={project.img}
                                alt={project.title}
                                loading="lazy"
                                onError={(e) => { e.target.src = `https://via.placeholder.com/400x300?text=${project.title}`; }}
                            />
                        </div>

                        <div className="portfolio-row-info">
                            <h3>{project.title}</h3>
                            <p className="portfolio-row-meta">{project.category} · 📍 {project.location}</p>
                        </div>

                        <span className="portfolio-arrow">↗</span>
                    </Link>
                ))}

                {filtered.length === 0 && (
                    <p className="portfolio-empty">No projects found in this category yet — check back soon!</p>
                )}
            </section>

            {/* CTA */}
            <section className="portfolio-cta">
                <h2>Like What You See?</h2>
                <p>Let's work together on your dream space.</p>
                <button onClick={() => window.location.href = '/contact'}>Start Your Project ↗</button>
            </section>
        </div>
    );
};

export default Portfolio;