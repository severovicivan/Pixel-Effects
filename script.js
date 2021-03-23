const canvas = document.getElementById('canvas1');
// Making instance of canvas 2d api object
const ctx = canvas.getContext('2d');
// Must be same as in css for correct scaling
canvas.width = 800;
canvas.height = 450;
// Image = special JS class constructor
const image1 = new Image();
// Assigning object property
image1.src = 'car.jpg'
// Adding load event listener
image1.addEventListener('load', function(){
    // Drawing image top left (0,0) [w,h are declared up]
    ctx.drawImage(image1, 0, 0);
})