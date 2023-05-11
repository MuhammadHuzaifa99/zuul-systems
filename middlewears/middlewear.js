exports.authCheck = (req,res,next) =>{
    const headerKey = req.headers["socket-header-key"] //|| req.headers["socket-header-key"]
    const secretKey = req.headers["socket-secret-key"] //|| req.headers["socket-secret-key"]

    
    console.log("out",headerKey, secretKey, req.headers);
    if(headerKey != process.env.HEADERKEY || secretKey != process.env.SECRETKEY){
        return res.status(404).json({
            status: false,
            message: "Unauthorized"
        })
    }
    return next()

}