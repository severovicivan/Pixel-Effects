// Bringing image into the project
const myImage = new Image();
// Some browsers considers pictures as bags of viruses so we must
myImage.src = 'selfie.png';

// Code that depends on loaded image goes inside function
myImage.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    // To access al canvas 2d drawing methods
    const ctx = canvas.getContext('2d');
    // To ensure right scaling
    canvas.width = 808;
    canvas.height = 811;
    // Drawing image on cnavas with builtin drawImage method
    ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    // Upper method work only when image is fully loaded so 

    // let is declaring VARIABLE so we can reassign later
    let particlesArray = [];
    const numberOfParticles = 5000;
    // We will use this class to make 5000 particle data objects
    class Particle {
        // This is mandatory method on JS class and contains blueprint
        constructor(){
            // for each individual particle.
            this.x = Math.random() * canvas.width;
            // We want particles to splash over image from TOP
            this.y = 0;
            // Falling speed will be 0 at frist based on bg brightness
            this.speed = 0;
            // Particles will fall on black areas very fast
            this.velocity = Math.random() * 3.5;
            // Particle size
            this.size = Math.random() * 1.5 + 1;
        }
        // Calculate particle position for each frame before drawing
        update(){
            // Randomizing particles falling
            this.y += this.velocity;
            // Once particle fall below bottom edge of canvas -> reset
            if (this.y >= canvas.height){
                // So they can fall from top again
                this.y = 0;
                // They will also get random horizontal (x) position
                this.x = Math.random() * canvas.width;
            }
        }
        // Custom draw method will draw circle to represent particle
        draw(){
            // Start drawing
            ctx.beginPath();
            ctx.fillStyle = 'white';
            // x, y, start angle, end angle
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Filling circular path  with color
            ctx.fill();
        }
    }
    function init(){
        for (let i = 0; i < numberOfParticles; i++){
            // new will trigger particle class constructor
            particlesArray.push(new Particle);
        }
    }
    // This will fill the array
    init();
    // This will be our main animation loop
    function animate(){
        ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
        // First I want semi-transparent black rectangle to be drawn over the canvas for every frame, to give fading trails
        ctx.globalAlpha = 0.05;
        // Up was transparency value given, o,o5 -> fully opaque
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Cycling through particles array for each animation frame
        for (let i = 0; i < particlesArray.length; i++){
            // Recalculating particle position and
            particlesArray[i].update();
            // Drawing them on new coordinates
            particlesArray[i].draw();
        }
        // Adding recursion for function to call itself over and over
        requestAnimationFrame(animate);
    }
    // Calling function to kick off animation loop
    animate();
});