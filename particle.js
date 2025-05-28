class Particle {
  constructor(
    position,
    colors = [[255, 255, 255]],
    density = 10
  ) {
    const colorIndex = Math.round(Math.random() * (colors.length - 1));
    this.color = colors[colorIndex];
    this.position = position;
    this.density = density;
  }

  update(state) {
    const positions = this.getPositions()
      .map((p) => ({ x: p[0], y: p[1] }))
      .filter(({ x, y }) => isWithinBounds(state, x, y))

    const foundEmpty = positions.find(({ x, y }) => isEmpty(state, x, y));
    if (foundEmpty) {
      this.position = foundEmpty;

    } else {
      const foundLessDensity = positions
        .map(({ x, y }) => state[y][x])
        .find((other) => other.density < this.density)

      if (foundLessDensity) {
        swap(this, foundLessDensity)
        state[foundLessDensity.position.y][foundLessDensity.position.x] = foundLessDensity
      }
    }
  }

  getPositions() {
    const { x, y } = this.position;
    return [
      [x, y + 1]
    ]
  }
}

export class Sand extends Particle {
  constructor(position) {
    super(
      position,
      [
        [255, 255, 0], // #FFFF00
        [240, 230, 140], //#F0E68C
        [189, 183, 107], // #BDB76B
      ],
    );
  }

  getPositions() {
    const { x, y } = this.position;
    return [
      [x, y + 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
    ];
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
      5
    );
    this.direction = Math.random() > 0.5 ? -1 : 1;
  }

  getPositions() {
    const { x, y } = this.position;
    return [
      [x, y + 1],
      [x + this.direction, y],
      [x - this.direction, y],
    ];
  }
}

export class Rock extends Particle {
  constructor(position) {
    super(
      position,
      [
        [128, 128, 128], //#808080
        [211, 211, 211], //#D3D3D3
      ]
    );
  }
}

function isWithinBounds(state, x, y) {
  return y >= 0 && y < state.length && x >= 0 && x < state[0].length;
}

function isEmpty(state, x, y) {
  return !state[y][x];
}

function swap(a, b) {
  var temp = a.position
  a.position = b.position
  b.position = temp
}