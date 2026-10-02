

const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Signup = async (req, res, next) => {
  console.log("signup api called");
  try {
    const { name, email, password } = req.body;
    let dupemail = await User.findOne({ email });
    if (dupemail) {
      return res.status(400).json({ message: "email already exist", success: false })
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: "all fields required", success: false })
    }
    else {
      const hashedpass = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: name,
        email: email,
        password: hashedpass
      });

      await newUser.save();
      console.log("new user saved");
      res.status(200).json({ message: "signup success", success: true });

    }

  }
  catch {
    res.status(500).json({ success: false, message: false });
  }

}
const Login = async (req, res, next) => {
  console.log("login api called")
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'invalid email' });
    }
    const hashedpass = user.password;

    const isMatch = await bcrypt.compare(password, hashedpass);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    console.log(process.env.NODE_ENV)
    console.log(user.id);


    const token = jwt.sign(
      {
        id: user.id,
        email: email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );
    console.log("token success")

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000
    })
    res.status(200).json({ message: "login success", success: true })
  }
  catch {
    res.status(500).json({ message: "internal server error", success: false });
  }


}
const logout = async (req, res) => {
    console.log("logout called");

    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during logout"
        });
    }
};




module.exports = {
  Signup,
  Login,
  logout,
}