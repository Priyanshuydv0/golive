const jwt = require("jsonwebtoken")

const isLoggedIn = async (req, res, next) => {
 
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (e) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })

    }


}
module.exports=isLoggedIn;