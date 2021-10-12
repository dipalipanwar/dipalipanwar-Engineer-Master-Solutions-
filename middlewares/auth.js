const jwt = require("jsonwebtoken") 

function auth(req, res, next) {

  const token = req.header("auth") 
  
  if (!token) {
    return res.status(422).send({ Error: "Invalid Token" }) 
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
   
    if (!decoded) {
      
      return res.status(422).send({ Error: "Unauthorized Access" }) 
    }
    req.user = decoded 

    next() 

  }catch(e){
   return res.status(422).send({Error: e}) 
  }
}

module.exports = auth 
