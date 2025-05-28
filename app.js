import { Rock, Sand, Water } from "./particle.js";

const output = document.getElementById("output");

class Engine {
  particles = [];
  brushSize = 20;
  particleClass = Sand;

  constructor(ctx) {
    this.ctx = ctx;
    this.height = ctx.canvas.height;
    this.width = ctx.canvas.width;
    this.state = createMatrix(this.height, this.width);

    // FPS calc
    this.previous = +Date.now();
    this.then = +Date.now();

    window.requestAnimationFrame(this.update.bind(this));
  }

  changeParticle(key) {
    switch (key) {
      case "W":
      case "w":
        this.particleClass = Water;
        break;
      case "R":
      case "r":
        this.particleClass = Rock;
        break;
      case "S":
      case "s":
      default:
        this.particleClass = Sand;
        break;
    }
  }

  spawn(x, y) {
    for (let j = y + this.brushSize; j > y - this.brushSize; j--) {
      for (let i = x - this.brushSize; i < x + this.brushSize; i++) {
        // Out of bounds
        if (i < 0 || i >= this.width || j < 0 || j >= this.height) continue;

        // Give it a less blocky shape
        if (Math.random() > 0.9) {
          const particle = new this.particleClass({ x: i, y: j });
          this.particles.push(particle);
        }
      }
    }
  }

  clear() {
    // Every paint will make the previous paint fainter for a nice trail effect
    this.ctx.fillStyle = "rgb(0 0 0 / 30%)";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  update(timestamp) {
    this.logFPS(timestamp);

    this.updatePositions()
    this.drawFrame();

    window.requestAnimationFrame(this.update.bind(this));
  }

  updatePositions() {
    for (let i = 0; i < 5; i++) {
      this.particles.forEach((particle) => {
        // Clear old position
        this.state[particle.position.y][particle.position.x] = null;
        // Update new position
        particle.update(this.state);
        this.state[particle.position.y][particle.position.x] = particle;
      });
    }
  }

  logFPS(timestamp) {
    const delta = timestamp - this.previous;
    this.previous = timestamp;
    output.textContent = `${(1000 / delta).toFixed(0)} fps`;
  }

  drawFrame() {
    this.clear();

    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);

    this.particles.forEach((particle) => {
      this.paintParticle(imageData.data, particle);
    });

    // Updating image data at once is more perfomant
    this.ctx.putImageData(imageData, 0, 0);
  }

  paintParticle(data, particle) {
    const index = 4 * (particle.position.x + particle.position.y * this.width);

    const [R, G, B] = particle.color;
    data[index + 0] = R;
    data[index + 1] = G;
    data[index + 2] = B;
    data[index + 3] = 255;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  // ctx.canvas.width = window.innerWidth * 0.8;
  // ctx.canvas.height = window.innerHeight * 0.8;
  const rect = canvas.getBoundingClientRect();

  const numElement = document.querySelector("#num");
  const engine = new Engine(ctx);

  function draw(e) {
    const x = Math.round(e.pageX - rect.left);
    const y = Math.round(e.pageY - rect.top);
    engine.spawn(x, y);
    numElement.textContent = engine.particles.length;
  }

  canvas.addEventListener("mousedown", draw);
  canvas.addEventListener("mousedown", () => {
    canvas.addEventListener("mousemove", draw);
  });

  canvas.addEventListener("mouseup", () => {
    canvas.removeEventListener("mousemove", draw);
  });

  window.addEventListener("keydown", (event) => {
    engine.changeParticle(event.key);
  });
});

function createMatrix(height, width) {
  return [...new Array(height)].map(() => new Array(width).fill(null));
}
