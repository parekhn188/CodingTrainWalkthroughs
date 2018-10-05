function nextGeneration() {
  calculateFitness();
  console.log('nextGeneration'); 

  for (let i = 0; i < popTotal; i++) {
    birds[i] = pickOne();
  }
  sBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - sBirds[index].fitness;
    index++;
  }
  index--;
  let bird = sBirds[index];
  let child = new Bird(bird.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let bird of sBirds) {
    sum += bird.score;
  }

  for (let bird of sBirds) {
    bird.fitness += bird.score / sum;
  }
}
