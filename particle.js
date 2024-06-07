class Particle {
  constructor(position, colors = [[255, 255, 255]], speed = 5) {
    const colorIndex = Math.round(Math.random() * (colors.length - 1));
    this.color = colors[colorIndex];
    this.position = position;
    this.speed = speed;
  }

  update(state) {
    for (let counter = 0; counter < this.speed; counter++) {
      this.updateFn(state);
    }
    return this.position; //for convenience
  }

  updateFn(state) {
    //noop
  }
}

export class Sand extends Particle {
  constructor(position) {
    super(position, [
      [255, 255, 0], // #FFFF00
      [240, 230, 140], //#F0E68C
      [189, 183, 107], // #BDB76B
    ]);
  }

  updateFn(state) {
    let { x, y } = this.position;

    if (y + 1 < state.length) {
      if (!state[y + 1][x]) {
        y++;
      } else if (!state[y + 1][x - 1]) {
        y++;
        x--;
      } else if (!state[y + 1][x + 1]) {
        y++;
        x++;
      }
    }

    this.position = { x, y };
  }
}

export class Rock extends Particle {
  constructor(position) {
    super(position, [
      [128, 128, 128], //#808080
      [211, 211, 211], //#D3D3D3
    ]);
  }

  updateFn(state) {
    let { x, y } = this.position;

    if (y + 1 < state.length && !state[y + 1][x]) {
      y++;
    }

    this.position = { x, y };
  }
}
