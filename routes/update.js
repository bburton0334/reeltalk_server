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


async function updateBio(req, res) {
    try {
        console.log(req.params);
      if (req.params.bioVal) {

        const bio = req.params.bioVal;
        const userEmail = req.params.email;

        console.log(bio + " " + userEmail);

        let query = `UPDATE user_db SET bio = "${bio}" WHERE email = "${userEmail}";`;
        console.log(query);
        pool.query(query, (err, rows, fields) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: "An error occurred. Update failed.",
            });
          } else {
            res.status(201).json({
              message: "Update was successful!",
              userUpdate: {
                bio: bio,
              },
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred. Update failed.",
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

  module.exports = { updateBio};