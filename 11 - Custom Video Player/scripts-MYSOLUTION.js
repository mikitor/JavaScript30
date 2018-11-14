// Getting different elements
const video = document.querySelector('.viewer');
const toggleButton = document.querySelector('.toggle');
const sliders = document.querySelectorAll('.player__slider');
const skippers = document.querySelectorAll('[data-skip]');
const progress = document.querySelector('.progress');
const progressFilled = document.querySelector('.progress__filled');
const fullScreenButton = document.querySelector('.full__screen');

// Storing flags
let mouseDown;
progress.style.cursor = "pointer";

function toggleVideoPlayback() {
    if (video.paused) {
        video.play();
        toggleButton.textContent = '▮▮';
    } else {
        video.pause();
        toggleButton.textContent = '►';
    }
}

function updateProgressBar(e) {
    if (!mouseDown) {
        progressFilled.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`
    } else {
        progressFilled.style.flexBasis = `${((e.pageX - progress.getBoundingClientRect().left) / progress.offsetWidth) * 100}%`;
    }
}

function skipControl() {
    video.currentTime += parseInt(this.dataset.skip);
}

function jumpToControl(e) {
    if (!mouseDown) {
        video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
    }
}

// Set video playback rate and volume
function sliderControl() {
    video[this.name] = this.value;
}

function toggleFullscreen() {
    const elem = video;
    if ((!document.fullscreenElement || document.fullscreenElement === undefined) && (!document.webkitFullscreenElement || document.webkitFullscreenElement === undefined) &&
        (!document.mozFullScreenElement || document.mozFullScreenElement === undefined) && (!document.msFullscreenElement || document.msFullscreenElement === undefined)) {
        if (elem.requestFullscreen) {
        elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
        document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
        }    
    }
}

// Different methods for toggling the playback of the video and toggling fullscreen
toggleButton.addEventListener('click', toggleVideoPlayback);
fullScreenButton.addEventListener('click', toggleFullscreen);
window.addEventListener('keydown', e => {
    if (e.key === " ") {
        toggleVideoPlayback();
    }
    if (e.key === "f") {
        toggleFullscreen();
    }
});
video.addEventListener('click', toggleVideoPlayback);

// Skipping and jumping in video
skippers.forEach(skipper => skipper.addEventListener('click', skipControl));
window.addEventListener('mouseup', (e) => {
    if (mouseDown) {
        mouseDown = false;
        jumpToControl(e);
    }
});
progress.addEventListener('mousedown', () => mouseDown = true);

// Updating the progress bar
window.addEventListener('mousemove', updateProgressBar);
video.addEventListener('timeupdate', updateProgressBar);

// Changing volume and playback rate
sliders.forEach(slider => slider.addEventListener('change', sliderControl));