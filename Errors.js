module.exports = {
    serverError: ({res, message}) => res.status(500).json({success: false, message})
}