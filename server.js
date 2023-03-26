const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use(express.static("public"));

app.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No audio file received");
  }

  // Save the audio file, process it or send it to another service
  console.log("Audio received:", req.file);

  res.status(200).send("Audio uploaded successfully");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

