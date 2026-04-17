const emptyFields = (config) => {
  return (req) => {
    const {
      required = [],
      atLeastOne = [],
      labels = {}
    } = config

    const getValue = (obj, path) => {
      return path.split('.').reduce((acc, key) => acc?.[key], obj)
    }

    // Valida campos obrigatórios
    const missing = required.filter(field => {
      const value = getValue(req.body, field)
      return value === undefined || 
             value === null || 
             (typeof value === 'string' && value.trim() === '')
    })

    if (missing.length) {
      const missingLabels = missing.map(f => labels[f] || f)
      return {
        valid: false,
        status: 400,
        message: `Campos obrigatórios ausentes: ${missingLabels.join(', ')}`,
        err: 'required-fields-missing'
      }
    }

    // Valida "pelo menos um"
    if (atLeastOne.length > 0) {
      const hasAtLeastOne = atLeastOne.some(field => {
        const value = getValue(req.body, field)
        return value !== undefined && 
               value !== null && 
               !(typeof value === 'string' && value.trim() === '')
      })

      if (!hasAtLeastOne) {
        const fieldLabels = atLeastOne.map(f => labels[f] || f)
        return {
          valid: false,
          status: 400,
          message: `Pelo menos um desses campos deve ser preenchido: ${fieldLabels.join(' ou ')}`,
          err: 'at-least-one-field-required'
        }
      }
    }
    return { valid: true }
  }
}

module.exports = emptyFields