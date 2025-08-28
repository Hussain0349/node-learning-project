
const reqLogger = (req,res,next) => {

    const currentTime = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - currentTime

        console.log(`${new Date()}  ${req.method} ${req.url} ${req.status} ${duration}`)
    })
    next()

}
export default reqLogger