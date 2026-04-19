const validateISBN = (isbn) => {
    // remove hífens e espaços
    const clean = isbn.replace(/[\s-]/g, '')

    // ISBN-10
    if (clean.length === 10) {
        const sum = clean.split('').reduce((acc, char, i) => {
            const val = char === 'X' ? 10 : parseInt(char)
            return acc + val * (10 - i)
        }, 0)
        if (sum % 11 === 0) return { valid: true, isbn: clean }
    }

    // ISBN-13
    if (clean.length === 13) {
        const sum = clean.split('').reduce((acc, char, i) => {
            return acc + parseInt(char) * (i % 2 === 0 ? 1 : 3)
        }, 0)
        if (sum % 10 === 0) return { valid: true, isbn: clean }
    }

    return { 
        valid: false, 
        message: 'ISBN inválido',
        err: 'invalid-isbn-insert'
    }
}

module.exports = validateISBN