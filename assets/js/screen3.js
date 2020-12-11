const camera = document.getElementById('js-camera');
const previewImage = document.getElementById('preview-img');
const actionButton = document.getElementById('action-button');
const saveButton = document.getElementById('save-button');
const sendButton = document.getElementById('send-button');
const player = document.getElementById('player');
const captureButton = document.getElementById('capture-button');
const outputCanvas = document.getElementById('output');
const context = outputCanvas.getContext('2d');


const height = window.innerHeight;
const width = window.innerWidth;

player.width =width;
player.height= height;

player.webkitRequestFullScreen();

function toggleCamera(status){
    if(status == 'show'){
        player.style.display = "block";
        captureButton.style.display = "block";
        startStreamedVideo(player);
        
    }else if(status == 'hide'){
        player.style.display = 'none';
        captureButton.style.display = 'none';
        stopStreamedVideo(player)
    }
}

function toggleBody(status){
    if(status == 'lock'){
        document.body.style.overflow = "hidden";
        document.body.style.height = window.innerHeight;
        $("html, body").animate({ scrollTop: 0 });
        
    }else if(status == 'unlock'){
        document.body.style.overflow = "unset";
        document.body.style.height = 'auto';
    }
    else if(status == 'fixed'){
        document.body.style.overflow = "unset";
        document.body.style.height =  window.innerHeight;
    }
}

function startStreamedVideo(player){
    navigator.mediaDevices
    .getUserMedia({ video: {facingMode: 'environment'} })
    .then((stream) => {
        player.srcObject = stream;
    }).catch(error => {
        console.error('Can not get an access to a camera...', error);
    });
}

function stopStreamedVideo(player) {
    const stream = player.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    player.srcObject = null;
}

function saveImage(outputCanvas){
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', `capture-${new Date().getTime()}.png`);
    outputCanvas.toBlob((blob) => {
        downloadLink.setAttribute('href', URL.createObjectURL(blob));
        downloadLink.click()
    });
}

function sendImage(outputCanvas){
    var dataURL = outputCanvas.toDataURL();
    $.ajax({
        type: "POST",
        url: "script.php",
        data: { 
            imgBase64: dataURL
        }
    }).done(function(o) {
        
        console.log('sent'); 
    });
}

function createCanvas(){
    const imageWidth = player.offsetWidth;
    const imageHeight = player.offsetHeight;
    
    outputCanvas.width = imageWidth;
    outputCanvas.height = imageHeight;
    
    context.drawImage(player, 0, 0, imageWidth, imageHeight);
}

function showImage(canvas){
    previewImage.src = canvas.toDataURL("image/png");
    previewImage.style.display = "block"
    actionButton.style.display = "block"
}


// ======================================
// action
// ======================================
camera.addEventListener('click', () => {
    toggleCamera('show');
    toggleBody('lock')
});

captureButton.addEventListener('click', () => {
    createCanvas();
    showImage(outputCanvas);
    toggleCamera('hide');
    toggleBody('fixed')
});

saveButton.addEventListener('click',function(){
    saveImage(outputCanvas);
    previewImage.style.display = "none"
    actionButton.style.display = "none"
    toggleBody('unlock')
    $("html, body").animate({ scrollTop: 0 });
})

sendButton.addEventListener('click',function(){
    sendImage(outputCanvas);
    previewImage.style.display = "none"
    actionButton.style.display = "none"
    toggleBody('unlock')
    $("html, body").animate({ scrollTop: 0 });
})