const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");

const imgServerUrl = process.env.IMG_SERVER_URL || "https://api.imgbb.com/1/upload";

const uploadImg = async (path) => {
  const formdata = new FormData();
  formdata.append("image", fs.createReadStream(path));
  formdata.append("key", "80d87c98ae82c96b3a22b8c793b25aeb");

  const response = await fetch(imgServerUrl, {
    method: "POST",
    body: formdata,
  });

  const { data } = await response.json();
  return data.display_url;
};

module.exports = uploadImg;
