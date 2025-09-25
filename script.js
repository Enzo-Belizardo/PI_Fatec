const wrapper = document.querySelector('.galeria_videos');
const videos = document.querySelectorAll('.reprodutor iframe');
const prevBtn = document.querySelector('.voltar');
const nextBtn = document.querySelector('.proximo');

let index = 0;

function showVideos() {
  const offset = -index * (videos[0].offsetWidth + 20);
  wrapper.style.transform = `translateX(${offset}px)`;
}

prevBtn.addEventListener('click', () => {
  index = (index > 0) ? index - 1 : videos.length - 1;
  showVideos();
});

nextBtn.addEventListener('click', () => {
  index = (index < videos.length - 1) ? index + 1 : 0;
  showVideos();
});

setInterval(() => {
  index = (index < videos.length - 1) ? index + 1 : 0;
  showVideos();
}, 5000);