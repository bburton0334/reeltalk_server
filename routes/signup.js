const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

let pool = mysql.createPool({
  connectionLimit: 10,
  host: "us-cdbr-east-06.cleardb.net",
  user: "beb68eb2e273e7",
  //bad practice refactor later
  password: "b316dc94",
  database: "heroku_e3b58127f1b060d",
});




// let pool = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "reelTalk",
//   //bad practice refactor later
//   password: "securepassword",
//   database: "awf_group_assignment",
// });

async function signup(req, res) {
  try {
    // console.log({ verified: verifyGoogleToken(req.body.credential) });
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;
      let query = `INSERT INTO user_db (email, name, picture, given_name, family_name, bio)\nVALUES("${profile.email}", "${profile.name}", "${profile.picture}", "${profile.given_name}", "${profile.family_name}", "");`;
      pool.query(query, (err, rows, fields) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "An error occurred. Registration failed.",
          });
        } else {
          res.status(201).json({
            message: "Signup was successful!",
            user: {
              email: profile.email,
              name: profile.name,
              picture: profile.picture,
              given_name: profile.given_name,
              family_name: profile.family_name,
              bio: "",
              token: jwt.sign({ email: profile?.email }, "myScret", {
                expiresIn: "1d",
              }),
            },
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred. Registration failed.",
    });
  }
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

module.exports = { signup };
