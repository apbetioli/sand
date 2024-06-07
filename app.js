import { Sand } from "./particle.js";

class Engine {
  particles = [];
  brushSize = 20;

  constructor(ctx) {
    this.ctx = ctx;
    this.height = ctx.canvas.height;
    this.width = ctx.canvas.width;
    this.state = createMatrix(this.height, this.width);

    this.update();
  }

  spawn(x, y) {
    for (let j = y + this.brushSize; j > y - this.brushSize; j--) {
      for (let i = x - this.brushSize; i < x + this.brushSize; i++) {
        // Out of bounds
        if (i < 0 || i >= this.width || j < 0 || j >= this.height) continue;

        // Give it a less blocky shape
        if (Math.random() > 0.9) {
          const particle = new Sand({ x: i, y: j });
          this.particles.push(particle);
        }
      }
    }
  }

  clear() {
    // Every paint will make the previous paint fainter for a nice trail effect
    this.ctx.fillStyle = "rgb(0 0 0 / 30%)";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  update() {
    this.clear();

    this.particles.forEach((particle) => {
      //clear previous particle position
      this.state[particle.position.y][particle.position.x] = null;

      //calculate next position
      particle.update(this.state);

      this.#paint(particle);
    });

    window.requestAnimationFrame(this.update.bind(this));
  }

  #paint(particle) {
    const { x, y } = particle.position;
    this.state[y][x] = particle;

    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = particle.color;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = window.innerWidth * 0.8;
  ctx.canvas.height = window.innerHeight * 0.8;
  const rect = canvas.getBoundingClientRect();

  const engine = new Engine(ctx);

  function draw(e) {
    const x = Math.round(e.pageX - rect.left);
    const y = Math.round(e.pageY - rect.top);
    engine.spawn(x, y);
  }

  canvas.addEventListener("mousedown", draw);
  canvas.addEventListener("mousedown", () => {
    canvas.addEventListener("mousemove", draw);
  });

  canvas.addEventListener("mouseup", () => {
    canvas.removeEventListener("mousemove", draw);
  });
});

function createMatrix(height, width) {
  return [...new Array(height)].map(() => new Array(width).fill(null));
}
