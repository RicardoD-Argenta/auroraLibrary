import { useState, useEffect, useRef } from 'react'
import styles from './EnumSelect.module.css'

const EnumSelect = ({ text, name, value, handleOnChange, options = [], disabled }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const wrapperRef = useRef(null)
    const controlRef = useRef(null)

    const selectedOption = options.find((opt) => opt.value === value) ?? null

    // fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false)
                setFocusedIndex(-1)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function toggle() {
        if (disabled) return
        setIsOpen((prev) => !prev)
        setFocusedIndex(-1)
    }

    function select(opt) {
        handleOnChange({ target: { name, value: opt.value } })
        setIsOpen(false)
        setFocusedIndex(-1)
        controlRef.current?.focus()
    }

    function handleKeyDown(e) {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!isOpen) { setIsOpen(true); return }
            if (focusedIndex >= 0) select(options[focusedIndex])
        } else if (e.key === 'Escape') {
            setIsOpen(false)
            setFocusedIndex(-1)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!isOpen) { setIsOpen(true); setFocusedIndex(0); return }
            setFocusedIndex((i) => Math.min(i + 1, options.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setFocusedIndex((i) => Math.max(i - 1, 0))
        }
    }

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper}${disabled ? ` ${styles.disabled}` : ''}`}
        >
            {text && <label>{text}</label>}
            <div
                ref={controlRef}
                className={`${styles.control}${isOpen ? ` ${styles.open}` : ''}`}
                onClick={toggle}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {selectedOption
                    ? <span className={styles['selected-label']}>{selectedOption.label}</span>
                    : <span className={styles.placeholder}>Selecione...</span>
                }
                <span className={`${styles.arrow}${isOpen ? ` ${styles.open}` : ''}`}>▼</span>
            </div>

            {isOpen && (
                <ul className={styles.dropdown} role="listbox">
                    {options.map((opt, index) => (
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            className={`${styles.option}${opt.value === value ? ` ${styles.active}` : ''}${index === focusedIndex ? ` ${styles.focused}` : ''}`}
                            onMouseEnter={() => setFocusedIndex(index)}
                            onMouseLeave={() => setFocusedIndex(-1)}
                            onMouseDown={(e) => { e.preventDefault(); select(opt) }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default EnumSelect
