import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './searchPanel.css';
import { filter } from 'framer-motion/client';

const searchData = {
    Google: 'https://www.google.com/search?q=',
    YouTube: 'https://www.youtube.com/results?search_query=',
    Instagram: 'https://www.instagram.com/explore/tags/',
    Twitter: 'https://twitter.com/search?q=',
    Reddit: 'https://www.reddit.com/search/?q=',
    Wikipedia: 'https://en.wikipedia.org/wiki/Special:Search?search=',
    Amazon: 'https://www.amazon.com/s?k=',
    eBay: 'https://www.ebay.com/sch/i.html?_nkw=',
    DuckDuckGo: 'https://duckduckgo.com/?q=',
    Bing: 'https://www.bing.com/search?q=',
    Yahoo: 'https://search.yahoo.com/search?p=',
    Pinterest: 'https://www.pinterest.com/search/pins/?q=',
    TikTok: 'https://www.tiktok.com/search?q=',
    LinkedIn: 'https://www.linkedin.com/search/results/all/?keywords=',
    Spotify: 'https://open.spotify.com/search/',
    GitHub: 'https://github.com/search?q=',
    StackOverflow: 'https://stackoverflow.com/search?q=',
    IMDB: 'https://www.imdb.com/find?q=',
    OpenAI: 'https://platform.openai.com/search?q='
}

const SearchPanel = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (query.trim()) {
            const filtered = Obj.keys(searchData).filter(platform => 
                platform.toLowerCase().includes(query.toLowerCase())
            )
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

    const handleResultSelect = (platform) => {
        if (query.trim() && searchData[platform]){
            window.open(`${searchData[platform]}${encodeURIComponent(query)}`, '_blank')  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
        }
        onClose()
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
                    placeholder="Search across platforms..."
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
                                {platform}
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