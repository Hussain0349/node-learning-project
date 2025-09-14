
const reqLogger = (req,res,next) => {

    const currentTime = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - currentTime

        console.log(new Date())
        console.log(req.method)
        console.log(req.statusCode)
        console.log(duration)

    })
    next()

}
export default reqLogger