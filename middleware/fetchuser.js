var jwt = require('jsonwebtoken');
const JWT_SECRET= 'usmanisagoodb$oy'

const fetchuser = (req,res,next)=>{
    //get the user from the JWT token and add id to req object
    const token= req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please Authenticate Using a valid token"})
    }
    try {
        const data =jwt.verify(token,JWT_SECRET);
        req.user= data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"ca Please Authenticate Using a valid Token"})
        }
}
module.exports = fetchuser;