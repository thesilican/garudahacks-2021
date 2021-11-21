navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: { facingMode: "environment" },
  })
  .then((stream) => { 
    const video = document.getElementById("video");
    const output = document.getElementById("output");
    const add = document.getElementById("add");
    const remove = document.getElementById("remove");
    const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });

    video.srcObject = stream;
    video.play();

    let timesUndetected = 0;
    let item;
    window.setInterval(() => {
      barcodeDetector.detect(video).then((x) => {
        if (x[0] === undefined) {
          timesUndetected++;
          if (timesUndetected === 5) {
            add.style["background-color"] = '#DDEDEA';
            add.style["font-weight"] = 'normal';
            remove.style["background-color"] = '#FBE4E4';
            remove.style["font-weight"] = 'normal';
            output.style["font-weight"]= 'normal';
  
            output.innerText = "Scan a food's QR code to add or remove it from your fridge.";
            item = null;
          }
        } else {
          timesUndetected = 0;
          add.style["background-color"] = '#A6D5CD';
          add.style["font-weight"] = 'bolder';
          remove.style["background-color"] = '#FFB9B4';
          remove.style["font-weight"] = 'bolder';
          output.style["font-weight"] = 'bolder';        

          item = x[0].rawValue;
          output.innerText = item;
        }
      })
    }, 100);
  });

document.getElementById("add").onclick(() => {
  if (item) {
    fetch("/api", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: item,
        command: "add"
      })
    })
  }
});

document.getElementById("remove").onclick(() => {
  if (item) {
    fetch("/api", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: item,
        command: "remove"
      })
    })
  }
});