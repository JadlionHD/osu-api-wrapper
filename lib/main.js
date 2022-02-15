const axios = require("axios");
const { OsuGameModes, OsuGameModesName } = require("./constants.js");

// Using v1 legacy osu api
// Docs: https://github.com/ppy/osu-api/wiki


/** Represent OsuAPI class */
class OsuAPI {
  #token;

  /**
   * @param {string} osuToken - Your secret osu api token
   * */
  constructor(osuToken) {
    if(!osuToken) throw new Error("Osu token required!");

    /**
     * @property {string} baseURL - Osu api base url
     * */
    this.baseURL = "https://osu.ppy.sh/api";
    this.#token = osuToken;
  }

  /**
   * Requesting Osu API
   * @param {string} endpoints - Endpoints of the api
   * @param {string} query - Url queries
   * @param {string} methods
   * */
  #_request = (endpoints, query, methods = "GET") => {
    if(!endpoints || typeof endpoints !== "string") throw new TypeError("No endpoints specified");
    if(!query || typeof query !== "string") throw new TypeError("No query specified");

    return new Promise((resolve, reject) => {
      axios({
        url: `${this.baseURL}${endpoints}?k=${this.#token}${query}`,
        method: methods
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    })
  }

  /**
   * Get User Data
   * @param {string} name - Name | ID of the user
   * @param {string} mode - Ingame modes
   * @returns {Promise}
   * */
  getUser(name, mode = "standard") {
    if(!name || typeof name !== "string") throw new TypeError("No username specified");
    return new Promise((resolve, reject) => {
      this.#_request("/get_user", `&u=${name}&m=${OsuGameModes[mode]}`).then((res) => {
        res.data[0]["mode"] = OsuGameModesName[mode];
        resolve(res.data[0]);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get User Best Performance Play Data
   * @param {string} name - Name | ID of the user
   * @param {string} mode - Ingame modes
   * @returns {Promise}
   * */
  getUserBest(name, mode = "standard") {
    if(!name || typeof name !== "string") throw new TypeError("No username specified");
    return new Promise((resolve, reject) => {
      this.#_request("/get_user_best", `&u=${name}&m=${OsuGameModes[mode]}`).then((res) => {
        res.data[0]["mode"] = OsuGameModesName[mode];
        resolve(res.data[0]);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = OsuAPI;
