const validator = require('validator')

const validatePhone = (phone) => {

  if (!phone || phone.trim() === '') {
    return { valid: true }
  }

  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '')

  // Valida telefone brasileiro (10 ou 11 dígitos)
  if (!validator.isMobilePhone(cleanPhone, 'pt-BR')) {
    return {
      valid: false,
      message: 'Telefone inválido!'
    }
  }

  return { 
    valid: true,
    phone: cleanPhone
  }
}

module.exports = validatePhone