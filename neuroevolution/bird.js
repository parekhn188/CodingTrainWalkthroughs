class Bird {
  constructor(brain) {
    this.y = height/2;
    this.x = 64;

    this.gravity = 0.5;
    this.lift = -12;
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 2)
    }
  }

  show() {
    stroke(255);
    fill(255, 100);
    ellipse(this.x, this.y, 32, 32);
  }

  offscreen() {
    return(this.y > height || this.y < 0);
  }

  up() {
    this.velocity += this.lift;
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  update() {
    this.score++;
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;
  }

  think(pipes) {
    let closest = null;
    let closestDist = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = (pipes[i].x + pipes[i].w) - this.x;
      if (d < closestDist && d > 0) {
        closest = pipes[i];
        closestDist = d;
      }
    }

    let inputs = [];
    inputs[0] = this.y/height;
    inputs[1] = closest.top/height;
    inputs[2] = closest.bottom/height;
    inputs[3] = closest.x/width;
    inputs[4] = this.velocity / 10;

    let outputs = this.brain.predict(inputs);

    if (outputs[0] > outputs[1]) {
      this.up();
    }
  }
}
