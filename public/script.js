const socket = io('/')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '4001'
})
const videoGrid = document.getElementById('video-grid')
myPeer.on('open',id=>{

    console.log(id)
    socket.emit('join-room',ROOM_ID, id);
})

const myVideo = document.createElement('video')
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false
}).then(stream=>{
    addVideoStream(myVideo, stream)

    myPeer.on('call',call=>{
        call.answer(stream)
        const newVideo = document.createElement('video')
        call.on('stream', userVideoStream=>{
            addVideoStream(newVideo,userVideoStream)
        })
    })

    socket.on('user-connect', userId=>{
        console.log("id: "+ userId)
        connectToNewUser(userId, stream)
    }) 
})


function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const newVideo = document.createElement('video')
    console.log("##")
    call.on('stream', userVideoStream=>{
        addVideoStream(newVideo,userVideoStream)
    })
    call.on('close',()=>{
        newVideo.remove()
    })
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}