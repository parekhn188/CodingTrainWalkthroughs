class Population {
  constructor(p, m, num) {

    this.population; // Array to hold the current population
    this.matingPool; // ArrayList which we will use for our "mating pool"
    this.generations = 0; // Number of generations
    this.finished = false; // Are we finished evolving?
    this.target = p; // Target phrase
    this.mutationRate = m; // Mutation rate
    this.perfectScore = 1;

    this.best = "";

    this.population = [];
    for (let i = 0; i < num; i++) {
      this.population[i] = new DNA(this.target.length);
    }
    this.matingPool = [];
    this.calcFitness();
  }

  // Fill our fitness array with a value for every member of the population
  calcFitness() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness(target);
    }
  }


  // Create a new generation
  generate() {
    // Refill the population with children from the mating pool
    var maxFitness = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    var newPopulation = [];

    for (var i = 0; i < this.population.length; i++) {
      var partnerA = this.acceptReject(maxFitness);
      var partnerB = this.acceptReject(maxFitness);
      var child = partnerA.crossover(partnerB);
      child.mutate(this.mutationRate);
      newPopulation[i] = child;
    }
    this.population = newPopulation;
    this.generations++;
  }


  acceptReject(maxFitness) {
    var besafe = 0;
    while (true) {
      var index = floor(random(this.population.length));
      var parent = this.population[index];
      var r = random(maxFitness);
      if (r < parent.fitness) {
        return parent;
      }
      besafe ++;
      if (besafe > 10000) {
        return null;
      }
    }
  }


  getBest() {
    return this.best;
  }

  // Compute the current "most fit" member of the population
  evaluate() {
    let worldrecord = 0.0;
    let index = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > worldrecord) {
        index = i;
        worldrecord = this.population[i].fitness;
      }
    }

    this.best = this.population[index].getPhrase();
    if (worldrecord >= this.perfectScore) {
      this.finished = true;
    }
  }

  isFinished() {
    return this.finished;
  }

  getGenerations() {
    return this.generations;
  }

  // Compute average fitness for the population
  getAverageFitness() {
    let total = 0;
    for (let i = 0; i < this.population.length; i++) {
      total += this.population[i].fitness;
    }
    return total / (this.population.length);
  }

  allPhrases() {
    let everything = "";

    let displayLimit = min(this.population.length, 50);


    for (let i = 0; i < displayLimit; i++) {
      everything += this.population[i].getPhrase() + "<br>";
    }
    return everything;
  }
}
