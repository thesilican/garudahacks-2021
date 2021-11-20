navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: { facingMode: "environment" },
  })
  .then((stream) => {
    const canvas = document.getElementById("canvas");
    const video = document.getElementById("video");
    const scan = document.getElementById("scan");
    const output = document.getElementById("output");

    video.srcObject = stream;
    video.play();
    video.addEventListener("playing", () => {
      const width = 300;
      const height = (video.videoHeight / video.videoWidth) * width;
      video.style.width = width + "px";
      video.style.height = height + "px";
      canvas.width = width;
      canvas.height = height;
    });

    scan.addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const barcodeDetector = new BarcodeDetector({
        formats: ["qr_code"],
      });
      barcodeDetector.detect(canvas).then((x) => {
        output.innerText = x[0]?.rawValue;
      });
    });
  });
