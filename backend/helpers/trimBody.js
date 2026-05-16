const trimBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        const trim = (obj) => {
            for (const key of Object.keys(obj)) {
                const val = obj[key]
                if (typeof val === 'string') {
                    obj[key] = val.trim()
                } else if (val && typeof val === 'object' && !Array.isArray(val)) {
                    trim(val)
                }
            }
        }
        trim(req.body)
    }
    next()
}

module.exports = trimBody
