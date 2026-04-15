const { isDate: validatorIsDate } = require('validator')

const getValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// Valida uma data individual no formato MM-DD-YYYY
const validateSingleDate = (date) => {
    if (!date || typeof date !== 'string') {
        return false
    }
    
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/
    const match = date.match(regex)
    if (!match) {
        return false
    }

    const [, month, day, year] = match
    const m = parseInt(month, 10)
    const d = parseInt(day, 10)
    const y = parseInt(year, 10)

    // Valida se o mês, dia e ano são válidos
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900) {
        return false
    }

    // Monta string ISO com padding (YYYY-MM-DD)
    const iso = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return validatorIsDate(iso)
}

const isDate = (config) => {
    return (req, res, next) => {
        const {
            dates = [],
            labels = {}
        } = config || {}

        // Valida cada data (campo no body)
        const invalidDates = dates.filter(field => {
            const value = req.body ? getValue(req.body, field) : undefined
            return !validateSingleDate(value)
        })

        if (invalidDates.length > 0) {
            const invalidLabels = invalidDates.map(f => labels[f] || f)
            res.status(400).json({
                message: `Datas inválidas: ${invalidLabels.join(', ')}`
            })
            return false
        }

        if (typeof next === 'function') {
            next()
            return
        }

        return true
    }
}

module.exports = isDate
