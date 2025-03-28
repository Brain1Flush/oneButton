import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './searchPanel.css';

const searchData = [
    "React Hooks",
    "Framer Motion",
    "Accessibility in React",
    "Responsive Design",
    "Weather API",
    "News Headlines",           // make links to websites like google yt, insta and so on
    "Keyboard Navigation",
];

const SearchPanel = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (query.trim()) {
            const filtered = searchData.filter(item => 
                item.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
            setActiveIndex(0);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                if (results[activeIndex]) {
                    handleResultSelect(results[activeIndex]);
                }
                break;
            case 'Escape':
                onClose();
                break;
            default:
                break;
        }
    };

    const handleResultSelect = (result) => {
        alert(`You selected: ${result}`);
        onClose();
    };

    useEffect(() => {
        if (resultsRef.current && results.length > 0) {
            const activeItem = resultsRef.current.children[activeIndex];
            if (activeItem) {
                activeItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }, [activeIndex, results]);

    return (
        <motion.div
            className="search-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="search-header">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search here..."
                    autoFocus
                    aria-label="Search input"
                />
                <button 
                    className="close-btn"
                    onClick={onClose}
                    aria-label="Close search panel"
                >
                    ×
                </button>
            </div>

            <div className="search-results-container">
                {results.length > 0 ? (
                    <ul ref={resultsRef} role="listbox">
                        {results.map((result, index) => (
                            <li
                                key={index}
                                className={index === activeIndex ? 'active-result' : ''}
                                onClick={() => handleResultSelect(result)}
                                role="option"
                                aria-selected={index === activeIndex}
                            >
                                {result}
                            </li>
                        ))}
                    </ul>
                ) : query ? (
                    <div className="no-result">No results found for "{query}"</div>
                ) : null}
            </div>
        </motion.div>
    );
};

export default SearchPanel;