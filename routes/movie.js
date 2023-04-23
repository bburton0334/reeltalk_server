/*
 *  FILE 		     : movie.js
 *  PROJECT 		 : SENG3080 - Group Assignment
 *  PROGRAMMERS	     : Ashley Ingle & Briana Burton
 *  LAST REVISION    : 2023-04-15
 *  DESCRIPTION 	 : This file contains the code to:
 *				       get all posts, create a new post, get a specific post, delete a post, and update a post's text.
 */

//bad practice, refactor later
const API_KEY = "3b790ba409827491bd18c6be15b1a07c";
const axios = require("axios").default;
const BASE_URL = "https://api.themoviedb.org/3";

//
// FUNCTION    : getMovieInfo
// DESCRIPTION : This function gets details of a Movie in TMDB when GET /movie/(id) is accessed
// PARAMETERS  :
// 		    req  : the GET request sent to the server
// 		    res  : the response sent by the server
// RETURNS 	   : error string in case of error, details of movie in JSON format if successful
//
async function getMovieInfo(req, res) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}&language=en-US`
    );
    res.json(response.data);
  } catch (err) {
    res.json(
      `Error ${err.response.data.status_code}: ${err.response.data.status_message}`
    );
  }
}

//
// FUNCTION    : searchMovieByTitle
// DESCRIPTION : This function gets details of a Movie in TMDB when GET /movie/(movieTitle) is accessed
// PARAMETERS  :
// 		    req  : the GET request sent to the server
// 		    res  : the response sent by the server
// RETURNS 	   : error string in case of error, details of movie in JSON format if successful
//
async function searchMovieByTitle(req, res) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${req.params.movieTitle}`
    );
    res.json(response.data);
  } catch (err) {
    res.json(
      `Error ${response.data.status_code}: ${response.data.status_message}`
    );
  }
}

//
// FUNCTION    : getMovieInfo
// DESCRIPTION : This function gets a list of similar movies to the provided movie GET /movie/(id) is accessed
// PARAMETERS  :
// 		    req  : the GET request sent to the server
// 		    res  : the response sent by the server
// RETURNS 	   : error string in case of error, array of JSON format movie details if successful
//
function getSimilarMovies(req, res) {
  //req.params.id
  //send get req to
  //ret

  async function getSimilarMovies(req, res) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/{req.params.id}/similar?api_key=${API_KEY}&language=en-US&page=1`
      );
      res.json(response.data);
    } catch (err) {
      res.json(
        `Error ${response.data.status_code}: ${response.data.status_message}`
      );
    }
  }
}


async function getSearchTerm(req, res) {
  console.log(req);

  const searchTerm = req.params.searchTerm;
  console.log(searchTerm);

  try {
    // Make a request to search for movies that match the search term
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`
    );

    // Choose the first movie from the search results to use as a basis for finding similar movies
    const movie = response.data.results[0];

    // Make a request to get a list of similar movies
    const similarResponse = await axios.get(
      // `${BASE_URL}/movie/${movie.id}/similar?api_key=${API_KEY}`
      `${BASE_URL}/movie/${movie.id}/recommendations?api_key=${API_KEY}`
    );

    // Return the list of similar movies as JSON
    res.json(similarResponse.data.results.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getMovieInfo, getSearchTerm };
