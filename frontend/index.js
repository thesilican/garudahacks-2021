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
    const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });

    video.srcObject = stream;
    video.play();

    scan.addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      barcodeDetector.detect(canvas).then((x) => {
        const value = x[0]?.rawValue;
        output.innerText = value;
      });
    });
  });
