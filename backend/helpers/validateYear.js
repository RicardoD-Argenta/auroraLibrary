const validYear = (year) => {
    const y = parseInt(year)
    if (isNaN(y) || String(year).trim().length > 5) {
        return { 
            valid: false, 
            message: 'Ano inválido', 
            err: 'invalid-year-insert' 
        }
    }
    return { valid: true, year: y }
}

module.exports = validYear