import { Sand } from "./particle.js";

class Engine {
  constructor(ctx) {
    this.ctx = ctx;
    this.height = ctx.canvas.height;
    this.width = ctx.canvas.width;
    this.state = createMatrix(this.height, this.width);
    this.nextState = createMatrix(this.height, this.width);
    this.update();
    this.brushSize = 15;
  }

  draw(x, y) {
    for (let j = y + this.brushSize; j > y - this.brushSize; j--) {
      for (let i = x - this.brushSize; i < x + this.brushSize; i++) {
        const particle = new Sand({ x: i, y: j });
        this.state[j][i] = particle;
        this.#paint(particle);
      }
    }
  }

  clear() {
    this.ctx.fillStyle = "rgb(0 0 0 / 30%)";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  update() {
    for (let row = this.height - 1; row >= 0; row--) {
      for (let col = 0; col < this.width; col++) {
        this.nextState[row][col] = null;

        if (this.state[row][col]) {
          const particle = this.state[row][col];
          const { x, y } = particle.update(this.nextState);
          this.nextState[y][x] = particle;
        }
      }
    }

    this.state = [...this.nextState].map((arr) => [...arr]);

    // repaint

    this.clear();

    for (let row = this.height - 1; row >= 0; row--) {
      for (let col = 0; col < this.width; col++) {
        if (this.state[row][col]) {
          this.#paint(this.state[row][col]);
        }
      }
    }

    window.requestAnimationFrame(() => this.update());
  }

  #paint(particle) {
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = particle.color;
    this.ctx.moveTo(particle.position.x, particle.position.y);
    this.ctx.lineTo(particle.position.x, particle.position.y);
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
    engine.draw(x, y);
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
