const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const buttons = document.querySelectorAll('button[name]');
let effect = '';

// EFFECT: add red
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 10; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
  return pixels;
}

// EFFECT: split the rgb values
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

// EFFECT: filter out rgb values based on sliders
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

// Get video stream from webcam
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = function () {
        video.play();
      };
    })
    .catch((err) => {
      console.error('OH NO', err);
    });
}

// Show the stream on canvas
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // transform the pixel data
    let pixels = ctx.getImageData(0, 0, width, height);
    if (effect === 'rgbSplit') {
      pixels = rgbSplit(pixels);
    } else if (effect === 'redEffect') {
      pixels = redEffect(pixels);
    } else if (effect === 'greenScreen') {
      pixels = greenScreen(pixels);
    }

    ctx.globalAlpha = 0.1;

    // but the transformed data on canvas
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

// Take a photo off the canvas
function takePhoto() {
  // play sound
  snap.currentTime = 0;
  snap.play();

  // create downloadable image
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

function changeEffect() {
  effect = this.name;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
buttons.forEach(button => button.addEventListener('click', changeEffect));
