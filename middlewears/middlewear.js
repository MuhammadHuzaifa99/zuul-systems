exports.authCheck = (req,res,next) =>{
    const headerKey = req.headers.socket_header_key
    const secretKey = req.headers.socket_secret_key
    const head = req.headers["socket-header-key"]
    const secret = req.headers["socket-secret-key"]
    
    console.log("out",req.headers);
    if(head != process.env.HEADERKEY || secret != process.env.SECRETKEY){
        return res.status(404).json({
            status: false,
            message: "Unauthorized"
        })
    }
    return next()

}