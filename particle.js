class Particle {
  constructor(position, colors = ["white"], speed = 5) {
    const colorIndex = Math.round(Math.random() * colors.length);
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
    super(position, ["Yellow", "Khaki", "DarkKhaki"]);
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
    super(position, ["gray", "lightgray"]);
  }

  updateFn(state) {
    let { x, y } = this.position;

    if (y + 1 < state.length && !state[y + 1][x]) {
      y++;
    }

    this.position = { x, y };
  }
}
