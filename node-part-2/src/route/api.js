
import express from 'express'
const apiRoutes = express.Router()


apiRoutes.get('/status',(req,res) => {
    res.status(200).json({
        status: 'server is running',
        uptime: process.uptime
    })
})
apiRoutes.get('/time', (req,res) => {
    res.status(200).json({
    currentTime: new Date().toISOString()
  })

})

export default apiRoutes


