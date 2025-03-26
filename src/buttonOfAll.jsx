import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './buttonOfAll.css'

const options = [
    { id: 1, label: "News", content: "📰 Latest headlines coming soon!"},
    { id: 2, label: "Weather", content: "☀️ Current weather: Sunny, 25°C" }, // Make this look at browser location for weather
    { id: 3, label: "Calendar", content: "📅 No upcoming events today."},
    { id: 4, label: "Search", content: "🔍 Search feature will be here."},
    { id: 5, label: "Notes", content: "📝 Your quick notes will go here." }
]

const ButtonOfAll = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [radius, setRadius] = useState(150)
    const [activeFeature, setActiveFeature] = useState(null)  // null only
    const [focusedIndex, setFocusedIndex] = useState(0)
    const buttonRef = useRef(null)
    const nodeRefs = useRef([])


    const toggleExpand = () => {
        setIsExpanded((prev) => !prev)
    }

    const handleNodeClick = (feature) => {
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
                            ref={(el) => (nodeRefs.current[index] = el)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Open ${option.label}`}
                            className='web-node'
                            onClick={() => handleNodeClick(option)}
                            initial={{ opacity: 0, scale: 0.5 }}
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
        </div>

        // <div className="buttonOfAll">This is a button</div> not used anymore
    )
}

export default ButtonOfAll;


// Motion and AnimatePresence from framer motion, npm i framer motion, check docs on their website if you get stuck