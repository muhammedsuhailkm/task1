const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

exports.search = async (query) => {
  const response = await axios.post(
    "https://google.serper.dev/search",
    { q: query },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.organic;
};
