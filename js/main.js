const image = document.getElementById('foto1');
const portada = document.querySelector('.portada'); 
const titulo = document.getElementById('titulo');
const artista = document.getElementById('artista');

const progresssContainer = document.getElementById('progressBar');
const progresss = document.getElementById('progresss');

const tiempoActual = document.getElementById('tiempoActual');
const duracion = document.getElementById('tiempoDuracion');

const musica = document.querySelector('audio');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const randomBtn = document.getElementById('random');
const repeatBtn = document.getElementById('repeat');

const songs = [
    { name: 'song1', displayName: 'Chk Chk Boom', artista: 'Stray Kids', image: 'img/album1.jpg', portada: 'img/portada1.jpg' },
    { name: 'song2', displayName: 'Killer Queen', artista: 'Queen', image: 'img/album2.jpg', portada: 'img/portada2.jpg' },
    { name: 'song3', displayName: 'Si Supieras', artista: 'Maelo Ruiz', image: 'img/album3.jpg', portada: 'img/portada3.jpg' },
    { name: 'song4', displayName: 'Mírame', artista: 'Blessd, Ovy On The Drums', image: 'img/album4.jpg', portada: 'img/portada4.jpg' },
    { name: 'song5', displayName: 'Hugo', artista: 'Eladio Carrión', image: 'img/album5.png', portada: 'img/portada5.jpg' },
    { name: 'song6', displayName: 'Afuera', artista: 'Caifanes', image: 'img/album6.jpg', portada: 'img/portada6.jpg' },
    { name: 'song7', displayName: 'Yandel 150', artista: 'Feid, Yandel', image: 'img/album7.jpg', portada: 'img/portada7.jpg' },
    { name: 'song8', displayName: 'Lose Yourself', artista: 'Eminem', image: 'img/album8.jpg', portada: 'img/portada8.jpg' },
    { name: 'song9', displayName: 'Vete', artista: 'Yeison Jimenez', image: 'img/album9.jpg', portada: 'img/portada9.jpg' },
    { name: 'song10', displayName: 'Hilito', artista: 'Romeo Santos', image: 'img/album10.jpg', portada: 'img/portada10.jpg' },
    { name: 'song11', displayName: 'Stressed Out', artista: 'Twenty One Pilots', image: 'img/album11.jpg', portada: 'img/portada11.jpg' }
];

let isPlaying = false;
let isRandom = false;
let isRepeat = false;
let songIndex = 0;

function loadSong(song) {
    titulo.textContent = song.displayName;
    artista.textContent = song.artista;
    musica.src = `musica/${song.name}.mp3`;
    musica.load();

    image.style.backgroundImage = `url('${song.image}')`;
    portada.style.backgroundImage = `url('${song.portada}')`;
}

function playSong() {
    musica.play().then(() => {
        isPlaying = true;
        playBtn.classList.replace('bx-play-circle', 'bx-pause-circle');
    }).catch((error) => {
        console.error('Error al reproducir la canción:', error);
    });
}

function pauseSong() {
    if (isPlaying) {
        musica.pause();
        isPlaying = false;
        playBtn.classList.replace('bx-pause-circle', 'bx-play-circle');
    }
}

function getRandomSongIndex() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === songIndex);
    return newIndex;
}

function prevSongs() {
    if (isRandom) {
        songIndex = getRandomSongIndex();
    } else {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
    }
    loadSong(songs[songIndex]);
    playSong(); // Intentar reproducir la canción
}

function nextSongs() {
    if (isRandom) {
        songIndex = getRandomSongIndex();
    } else {
        songIndex++;
        if (songIndex >= songs.length) {
            songIndex = 0; // Volver al inicio de la lista si se llega al final
        }
    }
    loadSong(songs[songIndex]);
    playSong(); // Intentar reproducir la canción
}

function updateProgressBar(e) {
    if (isPlaying) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progresss.style.width = `${progressPercent}%`;

        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        duracion.textContent = `${durationMinutes}:${durationSeconds}`;

        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        tiempoActual.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = musica;
    musica.currentTime = (clickX / width) * duration;
}

function toggleRandom() {
    isRandom = !isRandom;
    randomBtn.classList.toggle('active', isRandom);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSongs);
nextBtn.addEventListener('click', nextSongs);
randomBtn.addEventListener('click', toggleRandom);
repeatBtn.addEventListener('click', toggleRepeat);
musica.addEventListener('ended', () => {
    if (isRepeat) {
        playSong();
    } else {
        nextSongs();
    }
});
musica.addEventListener('timeupdate', updateProgressBar);
progresssContainer.addEventListener('click', setProgressBar);

// Cargar una canción específica basada en los parámetros de la URL
window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const songName = urlParams.get('cancion');

    if (songName) {
        const song = songs.find(s => s.name === songName);
        if (song) {
            loadSong(song);
            musica.addEventListener('canplaythrough', playSong); // Intentar reproducir la canción cuando esté lista
            console.log(`Canción cargada: ${songName}`);
        }
    } else {
        // Inicializar con la primera canción si no hay parámetros en la URL
        loadSong(songs[songIndex]);
        musica.addEventListener('canplaythrough', playSong); // Intentar reproducir la canción cuando esté lista
    }
});
