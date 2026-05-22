import { useState, useEffect } from 'react'

import Input from './Input'
import Button from './Button'
import List from '../lists/List'
import Pagination from '../lists/Pagination'

import styles from './SelectField.module.css'

const SelectField = ({ label, value, onChange, fetchItems, getLabel, renderItem, multi = false, maxItems = Infinity }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [items, setItems] = useState([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        let cancelled = false

        async function load() {
            setLoading(true)
            const data = await fetchItems(page, search)
            if (!cancelled) {
                setItems(data.items)
                setTotalPages(data.pages)
            }
            setLoading(false)
        }

        load()

        return () => { cancelled = true }
    }, [isOpen, page, search])

    function handleOpen() {
        setIsOpen(true)
    }

    function handleClose() {
        setIsOpen(false)
        setSearch('')
        setPage(1)
    }

    function handleSelect(item) {
        if (multi) {
            if (!value.some(i => i._id === item._id)) {
                onChange([...value, item])
            }
        } else {
            onChange(item)
        }
        handleClose()
    }

    function handleRemove(item) {
        if (multi) {
            onChange(value.filter(i => i._id !== item._id))
        } else {
            onChange(null)
        }
    }

    const canAddMore = multi ? value.length < maxItems : !value

    return (
        <div className={styles.selectField}>
            <label>{label}</label>
            <div className={`${styles.fieldRow} ${multi ? styles.fieldRowWrap : ''}`}>
                {multi ? (
                    <>
                        {value.map(item => (
                            <div key={item._id} className={styles.chip}>
                                <span>{getLabel(item)}</span>
                                <button type="button" className={styles.chipRemove} onClick={() => handleRemove(item)}>×</button>
                            </div>
                        ))}
                        {canAddMore && (
                            <Button type="button" variant="submit" onClick={handleOpen}>+</Button>
                        )}
                    </>
                ) : (
                    value ? (
                        <div className={styles.chip}>
                            <span>{getLabel(value)}</span>
                            <button type="button" className={styles.chipRemove} onClick={() => handleRemove(value)}>×</button>
                        </div>
                    ) : (
                        <Button type="button" variant="submit" onClick={handleOpen}>+</Button>
                    )
                )}
            </div>

            {isOpen && (
                <div className={styles.overlay} onClick={handleClose}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{label}</h3>
                            <button type="button" className={styles.closeBtn} onClick={handleClose}>×</button>
                        </div>
                        <div className={styles.modalSearch}>
                            <Input
                                text="Pesquisar"
                                type="text"
                                id="select-field-search"
                                name="search"
                                placeholder="Digite para pesquisar..."
                                value={search}
                                handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            />
                        </div>
                        <div className={styles.modalList}>
                            <List
                                loading={loading}
                                items={items}
                                renderItem={renderItem
                                    ? (item) => renderItem(item, handleSelect)
                                    : (item) => (
                                        <li
                                            key={item._id}
                                            className={styles.listItem}
                                            onDoubleClick={() => handleSelect(item)}
                                            title="Duplo clique para selecionar"
                                        >
                                            {getLabel(item)}
                                        </li>
                                    )
                                }
                                emptyMessage="Nenhum item encontrado."
                            />
                        </div>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default SelectField
