const APP_ID = '98f5e6ce7b224732805556566c27010f'
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('UID');
let NAME = sessionStorage.getItem('name');

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTrack = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    document.getElementById('room-name').innerText = CHANNEL

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    try{
        UID = await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch (error){
        console.error(error)
        window.open('/', '_self')
    }

    localTrack = await AgoraRTC.createMicrophoneAndCameraTracks()

    let member = await createMember()

    let player = `<div class="video-container" id="user-container-${UID}">
                            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                            <div class="video-player" id="user-${UID}">
                            </div>
                        </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTrack[1].play(`user-${UID}`)

    await client.publish([localTrack[0], localTrack[1]])
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === "video") {
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null) {
            player.remove()
        }
        let member = await getMember(user)

        player = `<div class="video-container" id="user-container-${user.uid}">
                            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                            <div class="video-player" id="user-${user.uid}">
                            </div>
                        </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === "audio") {
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalstream = async () => {
    for (let i = 0 ; localTrack.length > i ; i++) {
        localTrack[i].stop()
        localTrack[i].close()
    }

    await client.leave()

    deleteMember()

    window.open('/', '_self')
}

let toggleCameraLocalStream = async (e) => {
    if (localTrack[1] .muted){
        await localTrack[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTrack[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let toggleMicrophoneLocalStream = async (e) => {
    if (localTrack[0] .muted){
        await localTrack[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTrack[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let createMember = async () => {
    let response = await fetch('/create/member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
    return member
}

let getMember = async (user) => {
    let response = await fetch(`/member/?UID=${user.uid}&room=${CHANNEL}`)
    let member = await response.json()
    return member
}

let deleteMember = async () => {
    let response = await fetch('/delete/member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
}

window.addEventListener("beforeunload",deleteMember);

joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalstream)
document.getElementById('camera-btn').addEventListener('click', toggleCameraLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMicrophoneLocalStream)