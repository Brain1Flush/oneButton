import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import './buttonOfAll.css'
import SearchPanel from "./SearchPanel";
import { article } from "framer-motion/client";

const options = [
    { id: 1, label: "News", content: "Loading latest news..."},
    { id: 2, label: "Weather", content: "Fetching weather..." }, // Make this look at browser location for weather
    { id: 3, label: "Calendar", content: "📅 No upcoming events today."},
    { id: 4, label: "Search", content: "🔍 Search feature will be here."},
    { id: 5, label: "Notes App", content: (<a target='_blank' href='https://bbtodolistv2.netlify.app/'>Link to your notes</a>) }
]

const ButtonOfAll = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [radius, setRadius] = useState(150)
    const [activeFeature, setActiveFeature] = useState(null)  // null only
    const [focusedIndex, setFocusedIndex] = useState(0)
    const [weatherData, setWeatherData] = useState(null)
    const [newsData, setNewsData] = useState(null)
    const [showSearch, setShowSearch] = useState(false)
    const buttonRef = useRef(null)
    const nodeRefs = useRef([]) 

    const WEATHER_API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY
    const NEWS_API_KEY = import.meta.env.VITE_APP_NEWS_API_KEY
    // console.log(WEATHER_API_KEY)

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev)
    }

    const closeSearch = () => {
        setShowSearch(false)
        setActiveFeature(null)
    }

    const handleNodeClick = (feature) => {
        if (feature.label === "Search"){
            setShowSearch(true)
            return
        }

        if (feature.label === "Notes App"){
            window.open('https://bbtodolistv2.netlify.app/', '_blank')
        }

        if (feature.label === "Weather" && !weatherData) {
            fetchWeather()
        }
        if (feature.label === "News" && !newsData){
            fetchNews()
        }
        setActiveFeature(feature)
        setIsExpanded(false)
    }

    useEffect(() => {
        const updateRadius = () => {
            if (window.innerWidth < 600) setRadius(100)
            else if (window.innerWidth < 900) setRadius(130)
            else setRadius(150)
        }
        updateRadius()
        window.addEventListener('resize', updateRadius)
        return () => window.removeEventListener('resize', updateRadius)
    }, [])

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.container')) {
                setIsExpanded(false)
            }
        }
        document.addEventListener('click', handleOutsideClick)
        return () => document.removeEventListener('click', handleOutsideClick)
    }, [])

    const fetchWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
                    );

                    const weatherInfo = `🌡️ ${response.data.main.temp}°C - ${response.data.weather[0].description}`;
                    setWeatherData(weatherInfo);

                    // Update the Weather node with fetched data
                    const weatherNodeIndex = options.findIndex(
                        (option) => option.label === "Weather"
                    );
                    options[weatherNodeIndex].content = weatherInfo;
                } catch (error) {
                    console.error("Weather fetch error:", error);
                    setWeatherData("Unable to fetch weather.");
                }
            });
        } else {
            setWeatherData("Geolocation not supported.");
        }
    };

    const fetchNews = async () => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${NEWS_API_KEY}`
            );

            const headlines = response.data.articles
                .map((article) => `${article.title}`)
                .join("\n\n");
            setNewsData(headlines);

            const newsIndex = options.findIndex((o) => o.label === "News");
            options[newsIndex].content = headlines || "📰 No recent news available.";
        } catch (error) {
            console.error("News fetch error:", error);
            setNewsData("Unable to fetch news.");
        }
    };

    // Keyboard nav

    const handleKeyDown = (e) => {
        if (!isExpanded) {
            if (e.key === "Enter" || e.key === " ") toggleExpand()
            return
        }

        switch (e.key) {
            case "Escape":
                setIsExpanded(false)
                buttonRef.current?.focus()
                break
            case "ArrowRight":
            case "ArrowDown":
                setFocusedIndex((prev) => (prev + 1) % options.length)          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard
                break                                                           // https://stackoverflow.com/questions/71376615/how-to-add-keyboard-navigation-accessibility-access-to-existing-website-using
            case "ArrowLeft":
            case "ArrowUp":
                setFocusedIndex((prev) =>
                    prev === 0 ? options.length - 1 : prev - 1
                )
                break
            case "Enter":
                handleNodeClick(options[focusedIndex])
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (isExpanded) {
            nodeRefs.current[focusedIndex]?.focus()
        }
    }, [focusedIndex, isExpanded])

    return (
        <div className="container" onKeyDown={handleKeyDown}>
            <motion.button 
                ref={buttonRef}
                className="button-all" 
                // onMouseEnter={toggleExpand} // was causing issues removed
                // onMouseLeave={toggleExpand}
                onClick={toggleExpand}
                onTouchStart={toggleExpand}
                animate={{  scale: isExpanded ? 1.1 : 1 }}
                whileTap={{ scale: 0.9}}
                aria-expanded={isExpanded}
                aria-label="Open feature menu"
                >
                THIS IS A BUTTON
            </motion.button>

                {/* Somehow this is working again, DO NOT TOUCH */}
            <AnimatePresence>
                {isExpanded &&
                    options.map((option, index) => (
                        <motion.div
                            key={option.id}
                            className={`web-node ${activeFeature?.id === option.id ? 'active' : ''}`}
                            onClick={() => handleNodeClick(option)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Open ${option.label}`}
                            style={{
                                transform: `rotate(${(360 / options.length) * index}deg) translate(150px) rotate(-${(360 / options.length) * index}deg)`
                            }}
                            whileHover={{ scale: 1.2, boxShadow: "0 0 15px #4CAF50" }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            ref={(el) => (nodeRefs.current[index] = el)}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: Math.cos((2 * Math.PI * index) / options.length) * radius,  //Stupid cos and sin took me the whole day to figure out
                                y: Math.sin((2 * Math.PI * index) / options.length) * radius
                            }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{
                                type: 'string',
                                stiffness: 300,
                                damping: 20,
                                delay: index * 0.1
                            }}
                        >
                            {option.label}
                        </motion.div>
                    ))}
            </AnimatePresence>

            <AnimatePresence>
                {activeFeature && (
                    <motion.div
                        className="feature-panel"
                        initial={{ opacity: 0, y: 50 }}             // idk
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2>{activeFeature.label}</h2>
                        <p>{activeFeature.content}</p>
                        <button onClick={() => setActiveFeature(null)}>Close</button>
                    </motion.div>
                )}
            </AnimatePresence>
            {showSearch && <SearchPanel onClose={closeSearch} />}
            
        </div>

        // <div className="buttonOfAll">This is a button</div> not used anymore
    )
}

export default ButtonOfAll;


// Motion and AnimatePresence from framer motion, npm i framer motion, check docs on their website if you get stuck