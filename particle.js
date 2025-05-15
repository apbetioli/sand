class Particle {
  constructor(position, colors = [[255, 255, 255]], speed = 10) {
    const colorIndex = Math.round(Math.random() * (colors.length - 1));
    this.color = colors[colorIndex];
    this.position = position;
    this.speed = speed;
  }

  update(state) {
    throw new Error("updateFn not implemented");
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

  update(state) {
    let { x, y } = this.position;

    const positions = [
      [x, y + 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
    ];

    const found = positions.find((p) => isEmpty(state, p[0], p[1]));
    if (found) {
      [x, y] = found;
    }

    this.position = { x, y };
  }
}

export class Water extends Particle {
  constructor(position) {
    super(
      position,
      [
        [30, 144, 255], //#1E90FF
        [135, 206, 250], //#87CEFA
        [0, 0, 255], //#0000FF
      ],
      20
    );
    this.direction = Math.random() > 0.5 ? -1 : 1;
  }

  update(state) {
    let { x, y } = this.position;

    const positions = [
      [x, y + 1],
      [x + this.direction, y],
      [x - this.direction, y],
    ];

    const found = positions.find((p) => isEmpty(state, p[0], p[1]));
    if (found) {
      [x, y] = found;
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

  update(state) {
    let { x, y } = this.position;

    if (isEmpty(state, x, y + 1)) {
      y++;
    }

    this.position = { x, y };
  }
}

function isWithinBounds(state, x, y) {
  return y >= 0 && y < state.length && x >= 0 && x < state[0].length;
}

function isEmpty(state, x, y) {
  return isWithinBounds(state, x, y) && !state[y][x];
}
