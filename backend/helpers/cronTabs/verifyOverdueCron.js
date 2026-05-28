const cron = require('node-cron')
const LoanService = require('../../services/LoanService')

async function runVerification() {
    console.log('Verificando se há empréstimos vencidos...')
    const loanService = new LoanService()
    const result = await loanService.verifyOverdueLoans()
    console.log(result.message)
}

// roda ao iniciar o app para pegar empréstimos vencidos enquanto o sistema estava fechado
runVerification()

// roda a cada hora caso o app fique aberto
cron.schedule('0 0 * * * *', runVerification)

module.exports = cron