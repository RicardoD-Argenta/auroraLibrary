const DashboardService = require('../services/DashboardService')
const dashboardService = new DashboardService()

module.exports = class DashboardController {

    static async getDashboard(req, res) {
        const result = await dashboardService.getDashboardData()

        if (!result.valid) {
            return res.status(500).json({
                message: result.message,
                err: result.err
            })
        }

        return res.status(200).json(result.dashboard)
    }
}
