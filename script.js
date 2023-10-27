const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const playlist = $(".playlist");
const heading = $('.header');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
currentIndex: 0,
isPlaying : false,
isRandom: false,
isRepeat : false,
  songs: [
    {
      name: "Grow As We Go",
      singer: "Ben Platt",
      path: 'path/goAsWeGo.mp3',
      image: 'images/growAsWeGo.jpg'
    },
    {
      name: "Happy Life",
      singer: "Roland Faunte",
      path: 'path/happyLife.mp3',
      image: 'images/happyLife.jpg'
    },
    {
      name: "Sweet Tooth",
      singer: "Cavetown",
      path: 'path/sweetTooth.mp3',
      image: 'images/sweetTooth.jpg'
    },
    {
      name: "Human Behaviour",
      singer: "Emma Blackery",
      path: 'path/humanBehaviour.mp3',
      image: 'images/humanBehaviour.jpg'
    },
    {
      name: "Drippin Jimmy",
      singer: "Saul Goodman",
      path: 'path/drippingJimmy.mp3',
      image: 'images/drippingJimmy.jpg'
    }
 
  ],
  render: function(){
const htmls = this.songs.map((song, index) => {
  return  `   <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`
    
}
)

 playlist.innerHTML = htmls.join("");

},

scrollToActiveSong: function(){
  setTimeout(() => 
  $('.song.active').scrollIntoView({
    behaviour: 'smooth',
    block: 'end'
  }

  ),300
  );
},

defineProperties: function(){
  Object.defineProperty(this, 'currentSong', {
    get: function(){
      return this.songs[this.currentIndex];
    }
  })
},

loadCurrentSong: function(){
heading.textContent = this.currentSong.name;
cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
audio.src = this.currentSong.path;

},
//Xử lý chuyển bài hát
nextSong: function(){
this.currentIndex++;
if (this.currentIndex >= this.songs.length){
  this.currentIndex = 0;
}
this.loadCurrentSong();
},

prevSong: function(){
this.currentIndex--;
if (this.currentIndex < 0 ){
  this.currentIndex = this.songs.length - 1;
}

this.loadCurrentSong();
},

playRandomSong: function(){
  let newIndex
do{
  newIndex = Math.floor(Math.random()*this.songs.length);
  
 }
 while(newIndex === this.currentIndex)

 this.currentIndex = newIndex;
 this.loadCurrentSong();
 
},

removeActiveSong: function(){
  const activeSong = $('.song.active');
if (Number(activeSong.dataset.index) !== this.currentIndex){
  activeSong.classList.remove('active');
}
},

addActiveSong: function(){
  const activeSong = $$('.song');
activeSong.forEach(function(song){
  if (Number(song.dataset.index) === app.currentIndex){
    song.classList.add('active');
  }
})
},

handleEvents(){



//Xử lý CD quay và dừng

const cdThumbAnimate = cdThumb.animate([
  {transform: 'rotate(360deg)'}
],
{
  duration: 10000,
  iterations: Infinity
});

cdThumbAnimate.pause();

  const cdWidth = cd.offsetWidth;
document.onscroll = function(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const newCdWidth = cdWidth - scrollTop;

 cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
 cd.style.opacity = newCdWidth/cdWidth 
}

playBtn.onclick = function(){
  if (app.isPlaying){
    audio.pause();
   
    
  }
 else{
  audio.play();
 }
}

 audio.onplay = function(){
  app.isPlaying = true;
  player.classList.add('playing');
  cdThumbAnimate.play();
 }

 audio.onpause = function(){
  app.isPlaying = false;
  player.classList.remove('playing');
  cdThumbAnimate.pause();
 }

 audio.ontimeupdate = function(){
  if (audio.currentTime/audio.duration){
    const progressPercentage = audio.currentTime/audio.duration * 100;
    progress.value = progressPercentage;
  }
}
  
progress.onchange = function(e){
  const seekTime =  audio.duration*e.target.value / 100;
audio.currentTime = seekTime;

}

nextBtn.onclick = function(){
  if (app.isRandom){
    app.playRandomSong();
    audio.play()
    app.removeActiveSong();
    app.addActiveSong();
    app.scrollToActiveSong();
  }
  else{
  app.nextSong();
  audio.play();
  app.removeActiveSong();
  app.addActiveSong();
  app.scrollToActiveSong();
}
}
prevBtn.onclick = function(){
  if (app.isRandom){
    app.playRandomSong();
    audio.play();
    app.removeActiveSong();
    app.addActiveSong();
    app.scrollToActiveSong();
  }
  else{
  app.prevSong();
  audio.play();
  app.removeActiveSong();
  app.addActiveSong();
  app.scrollToActiveSong();
}
}

audio.onended = function(){
  if (app.isRepeat){
    audio.play();
  }else{
  nextBtn.click();
  }
}

randomBtn.onclick = function(e){
app.isRandom = !app.isRandom;
randomBtn.classList.toggle('active', app.isRandom);
}

repeatBtn.onclick = function(e){

  app.isRepeat = !app.isRepeat;
  repeatBtn.classList.toggle('active', app.isRepeat);

}

playlist.onclick = function(e){
const songNode = e.target.closest('.song:not(.active)');

if (songNode || e.target.closest('.option')){
  console.log(songNode.dataset)
  app.currentIndex = Number(songNode.dataset.index);
  app.loadCurrentSong();
  app.removeActiveSong();
  app.addActiveSong();
  audio.play();

}
  

}


},

  start : function(){
    this.defineProperties();
    this.loadCurrentSong();
    this.handleEvents();
   
this.render();
  
}

}
app.start();
