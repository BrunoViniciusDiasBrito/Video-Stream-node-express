const fs = require("fs");
const path = require("path");

module.exports = function (app) {
  app.get("/streaming", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "stream.html"));
  });

  app.get("/streaming/video", (req, res) => {
    const title = (req.headers.VideoTitle = "dbzMeme");
    const range = req.headers.range;

    if (!range) {
      res.status(400).send("requires range headers");
      return;
    }

    const videoPath = `./public/source/${title}.mp4`;
    const videoSize = fs.statSync(videoPath).size;

    //Parse Range
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
      Title: title,
    };

    res.writeHeader(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  });

  app.get("/contato", (req, res) => {
    res.sendFile("contato.html", { root: path.join(__dirname, "../public") });
  });
};
