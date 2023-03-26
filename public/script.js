const recordButton = document.getElementById("recordButton");
let isRecording = false;
let audioChunks = [];
let mediaRecorder;

// Request user's audio input
const requestAudioInput = async () => {
  const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(audioStream);

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    audioChunks = [];
    await uploadAudio(audioBlob);
  };
};

// Upload audio to the server
const uploadAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Audio uploaded successfully");
    } else {
      console.error("Error uploading audio");
    }
  } catch (error) {
    console.error("Error uploading audio", error);
  }
};

// Toggle recording state
recordButton.addEventListener("click", async () => {
  if (!isRecording) {
    await requestAudioInput();
    mediaRecorder.start();
    recordButton.textContent = "Stop";
  } else {
    mediaRecorder.stop();
    recordButton.textContent = "Record";
  }

  isRecording = !isRecording;
});
