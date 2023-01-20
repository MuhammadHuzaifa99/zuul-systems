exports.authCheck = (req,res,next) =>{
    const headerKey = req.headers.socket_header_key
    const secretKey = req.headers.socket_secret_key
    
    console.log("out",headerKey, secretKey);
    if(headerKey != process.env.HEADERKEY || secretKey != process.env.SECRETKEY){
        return res.status(404).json({
            status: false,
            message: "Unauthorized"
        })
    }
    return next()

}