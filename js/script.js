console.log('Lets write some javascript');
let currentSong = new Audio();
let songs
let currFolder
function secondsToMinutesSeconds(seconds){
    if (isNaN(seconds) || seconds<0){
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")} </div>
                                <div>Abhi_07 </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/playsong.svg" alt="">
                            </div>
        
       </li>`;
    }


    //Attach an event listener to every song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    
}


const playMusic = (track, pause = false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    
}


// async function displayAlbums() {
//     let a = await fetch(``/${folder}/``)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     anchors.forEach(e=>{
//         if(e.href.includes("/songs/")){

//         }
//     })
// }



async function main() {

    // Get the list of all the songs
    await getSongs("songs/sads")
    playMusic(songs[0], true)


    // display all the albums on the page    
    displayAlbums()

    // Attach an event listener to play, next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/playsong.svg"
        }
    })



    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${
            secondsToMinutesSeconds(currentSong.duration)
        }`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + "%"
    })




    // Add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration)* percent)/100
    })




    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })



    // Add an event listener to prev and next
    previous.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        } 
    })

    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1) < songs.length){
            playMusic(songs[index+1])
    }
})




    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = e.target.value/100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }
    })




    // Select the library of your choice
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })



    // Audio.addEventListener("loadeddata", ()=>{
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    //     // The duration variable now holds the duration (in second) of the audio clip
    // })

}

main()