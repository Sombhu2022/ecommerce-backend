import jwt from "jsonwebtoken";


export const sendCookic = (user, res, message, statusCode = 200) => {
   
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res
    .status(statusCode)
    .cookie("token",token , {
      expires: new Date(Date.now() + 30*24*60*60*1000), // Set expiration time
      httpOnly: true,
      sameSite: "None",
      secure:true,
    })
    .json({
      success: true,
      message,
      token: token,
      user
    });
};

// const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// res.cookie('jwt', token, {
//   httpOnly: true, // Prevent JavaScript access for security
//   secure: process.env.NODE_ENV === 'production', // Set to true in production
//   sameSite: 'lax', // Mitigate CSRF attacks
//   path: '/', // Accessible from all paths
//   expires: new Date(Date.now() + 3600000), // Set expiration time
// });

