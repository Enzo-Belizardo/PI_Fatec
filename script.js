const wrapper = document.querySelector('.galeria_videos');
const videoContainer = document.querySelector('.reprodutor');
const videos = document.querySelectorAll('.reprodutor iframe');
const voltarBtn = document.querySelector('.voltar');
const proximoBtn = document.querySelector('.proximo');

let index = 0;

function showVideos() {
  const offset = -index * (videos[0].offsetWidth);
  videoContainer.style.transform = `translateX(${offset}px)`;
}

if (voltarBtn) {
  voltarBtn.addEventListener('click', () => {
    index = (index > 0) ? index - 1 : videos.length - 1;
    showVideos();
  });
}

if (proximoBtn) {
  proximoBtn.addEventListener('click', () => {
    index = (index < videos.length - 1) ? index + 1 : 0;
    showVideos();
  });
}

setInterval(() => {
  index = (index < videos.length - 1) ? index + 1 : 0;
  showVideos();
}, 50000);