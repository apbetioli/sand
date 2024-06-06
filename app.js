class Engine {
  constructor(ctx) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.matrix = [...new Array(this.height)].map(() =>
      new Array(this.width).fill(0)
    );
  }

  draw(x, y) {
    this.matrix[y][x] = 1;
    this.#paintPixel(x, y);
  }

  paint() {
    this.matrix.forEach((row, r) => {
      row.forEach((col, c) => {
        if (this.matrix[r][c]) {
          this.#paintPixel(c, r);
        }
      });
    });
  }

  #paintPixel(x, y) {
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "yellow";
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
