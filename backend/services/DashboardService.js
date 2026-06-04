// models
const Loan = require('../models/Loan/Loans')
const LoanDelay = require('../models/Loan/LoanDelay')
const BookCopy = require('../models/Book/BookCopy')
const Member = require('../models/Library/Member')

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

module.exports = class DashboardService {

    async getDashboardData() {
        try {
            const now = new Date()
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

            // --- contagens em paralelo ---
            const [
                activeLoans,
                overdueLoans,
                availableCopies,
                totalCopies,
                totalMembers,
                newMembersThisMonth,
                currentMonthLoans,
                previousMonthLoans,
                currentMonthDelays,
                previousMonthDelays,
            ] = await Promise.all([
                Loan.countDocuments({ status: 'active' }),
                Loan.countDocuments({ status: 'overdue' }),
                BookCopy.countDocuments({ status: 'available' }),
                BookCopy.countDocuments({}),
                Member.countDocuments({}),
                Member.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
                Loan.countDocuments({ loanDate: { $gte: startOfCurrentMonth } }),
                Loan.countDocuments({ loanDate: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } }),
                LoanDelay.countDocuments({ createdAt: { $gte: startOfCurrentMonth } }),
                LoanDelay.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } }),
            ])

            // --- variação percentual de empréstimos ---
            let loanVariation = 0
            if (previousMonthLoans > 0) {
                loanVariation = ((currentMonthLoans - previousMonthLoans) / previousMonthLoans) * 100
            } else if (currentMonthLoans > 0) {
                loanVariation = 100
            }
            loanVariation = Math.round(loanVariation)

            // --- variação percentual de atrasos ---
            let delayVariation = 0
            if (previousMonthDelays > 0) {
                delayVariation = ((currentMonthDelays - previousMonthDelays) / previousMonthDelays) * 100
            } else if (currentMonthDelays > 0) {
                delayVariation = 100
            }
            delayVariation = Math.round(delayVariation)

            // --- empréstimos dos últimos 6 meses ---
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
            const loansByMonthRaw = await Loan.aggregate([
                { $match: { loanDate: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: { year: { $year: '$loanDate' }, month: { $month: '$loanDate' } },
                        total: { $sum: 1 }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])

            const loansByMonth = []
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const year = d.getFullYear()
                const month = d.getMonth() + 1
                const found = loansByMonthRaw.find(r => r._id.year === year && r._id.month === month)
                loansByMonth.push({
                    month: MONTHS_PT[d.getMonth()],
                    total: found ? found.total : 0
                })
            }

            // --- top 5 livros mais emprestados ---
            const topBooks = await Loan.aggregate([
                { $group: { _id: '$copyId', total: { $sum: 1 } } },
                { $lookup: { from: 'bookcopies', localField: '_id', foreignField: '_id', as: 'copy' } },
                { $unwind: '$copy' },
                { $group: { _id: '$copy.bookId', total: { $sum: '$total' } } },
                { $sort: { total: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
                { $unwind: '$book' },
                { $project: { _id: 0, bookId: '$_id', title: '$book.title', total: 1 } }
            ])

            // --- distribuição de gêneros no acervo ---
            const genreDistRaw = await BookCopy.aggregate([
                { $lookup: { from: 'books', localField: 'bookId', foreignField: '_id', as: 'book' } },
                { $unwind: '$book' },
                { $unwind: '$book.genresId' },
                { $group: { _id: '$book.genresId', total: { $sum: 1 } } },
                { $lookup: { from: 'genres', localField: '_id', foreignField: '_id', as: 'genre' } },
                { $unwind: '$genre' },
                { $project: { _id: 0, genre: '$genre.name', total: 1 } },
                { $sort: { total: -1 } }
            ])

            const totalForPercentage = genreDistRaw.reduce((acc, g) => acc + g.total, 0)
            const genreDistribution = genreDistRaw.map(g => ({
                genre: g.genre,
                total: g.total,
                percentage: totalForPercentage > 0
                    ? Math.round((g.total / totalForPercentage) * 1000) / 10
                    : 0
            }))

            // --- top membros que mais pegaram emprestado no mês atual ---
            const topMembers = await Loan.aggregate([
                { $match: { loanDate: { $gte: startOfCurrentMonth } } },
                { $group: { _id: '$memberId', total: { $sum: 1 } } },
                { $sort: { total: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'members', localField: '_id', foreignField: '_id', as: 'member' } },
                { $unwind: '$member' },
                { $project: { _id: 0, memberId: '$_id', memberName: '$member.name', total: 1 } }
            ])

            // --- atividade recente (últimos 5 eventos entre empréstimos e devoluções) ---
            const [recentLoans, recentReturns] = await Promise.all([
                Loan.find({ status: { $in: ['active', 'overdue'] } })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate({ path: 'memberId', select: 'name' })
                    .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title' } })
                    .lean(),
                Loan.find({ status: 'returned', returnDate: { $ne: null } })
                    .sort({ updatedAt: -1 })
                    .limit(5)
                    .populate({ path: 'memberId', select: 'name' })
                    .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title' } })
                    .lean()
            ])

            const activityItems = [
                ...recentLoans.map(l => ({
                    loanId: l._id,
                    memberName: l.memberId?.name ?? null,
                    bookTitle: l.copyId?.bookId?.title ?? null,
                    type: 'empréstimo',
                    date: l.createdAt
                })),
                ...recentReturns.map(l => ({
                    loanId: l._id,
                    memberName: l.memberId?.name ?? null,
                    bookTitle: l.copyId?.bookId?.title ?? null,
                    type: 'devolução',
                    date: l.updatedAt
                }))
            ]
            activityItems.sort((a, b) => new Date(b.date) - new Date(a.date))
            const recentActivity = activityItems.slice(0, 5)

            // --- lista de empréstimos vencidos ---
            const overdueLoansData = await Loan.find({ status: 'overdue' })
                .populate({ path: 'memberId', select: 'name' })
                .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title' } })
                .lean()

            const overdueIds = overdueLoansData.map(l => l._id)
            const overdueDelays = await LoanDelay.find({ loanId: { $in: overdueIds } }).select('loanId').lean()
            const delayByLoanId = Object.fromEntries(overdueDelays.map(d => [d.loanId.toString(), d._id]))

            const overdueList = overdueLoansData.map(l => ({
                overdueId: l._id,
                loanDelayId: delayByLoanId[l._id.toString()] ?? null,
                memberName: l.memberId?.name ?? null,
                bookTitle: l.copyId?.bookId?.title ?? null,
                daysLate: Math.floor((now - new Date(l.dueDate)) / (1000 * 60 * 60 * 24))
            })).sort((a, b) => b.daysLate - a.daysLate)

            return {
                valid: true,
                dashboard: {
                    activeLoans,
                    overdueLoans,
                    availableCopies,
                    totalCopies,
                    totalMembers,
                    newMembersThisMonth,
                    loanVariation,
                    delayVariation,
                    loansByMonth,
                    topBooks,
                    genreDistribution,
                    recentActivity,
                    overdueList,
                    topMembers
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar dados do dashboard',
                err: error.message
            }
        }
    }
}
