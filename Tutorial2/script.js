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
    // Upper method work only when image is fully loaded so eventListen
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Deleting original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // let is declaring VARIABLE so we can reassign later
    let particlesArray = [];
    const numberOfParticles = 5000;
    // Brightness values of each pixel with x and y coordinates
    let mappedImage = [];
    // We will cycle through every pixel in this image row by row L-R
    for(let y = 0; y < canvas.height; y++){
        let row = [];
        // For every row we loop through 808 pixels (width)
        for(let x = 0; x < canvas.width; x++){
            // Fetching positions of RGB values
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            // Thanks to hoisting (raising) we can call
            const brightness = calculateRelativeBrightness(red,green,blue);
            // Each cell = representation for 1 pixel
            const cell = [
                brightness,
            ];
            // Pushing pixels on row
            row.push(cell);
        }
        // Pushing rows to form brightness representation of image
        mappedImage.push(row);
    }
    console.log(mappedImage);
    // Getting relative brightness of pixel (R + G + B values / 3)
    function calculateRelativeBrightness(red, green, blue){
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        )/100;
    }
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
            // Particles will fall on black areas not so monotoneous
            this.velocity = Math.random() * 0.5;
            // Particle size
            this.size = Math.random() * 1.5 + 1;
            // Coordinate position must be int so we must round it
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
        }
        // Calculate particle position for each frame before drawing
        update(){
            // Every time we update x and y this values must stay integers
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            // Pulling brightness value [0] based on coordinates (y,x)
            this.speed = mappedImage[this.position1][this.position2][0];
            // Dark particles that have brightness close to 0 move faster and light brightness close to 2.5(max) move slower we'll flip it
            let movement = (2.5 - this.speed) + this.velocity;
            // Randomizing particles falling
            this.y += movement;
            // Once particle fall below bottom edge of canvas -> reset
            if(this.y >= canvas.height){
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
        for(let i = 0; i < numberOfParticles; i++){
            // new will trigger particle class constructor
            particlesArray.push(new Particle);
        }
    }
    // This will fill the array
    init();
    // This will be our main animation loop
    function animate(){
        // First I want semi-transparent black rectangle to be drawn over the canvas for every frame, to give fading trails
        ctx.globalAlpha = 0.05;
        // Up was transparency value given, o,o5 -> fully opaque
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.2;
        // Cycling through particles array for each animation frame
        for(let i = 0; i < particlesArray.length; i++){
            // Recalculating particle position and
            particlesArray[i].update();
            ctx.globalAlpha = particlesArray[i].speed * 0.5;
            // Drawing them on new coordinates
            particlesArray[i].draw();
        }
        // Adding recursion for function to call itself over and over
        requestAnimationFrame(animate);
    }
    // Calling function to kick off animation loop
    animate();
});