function sigmoid(x) {
  return 1/(1+ Math.exp(-x));
}

function dsigmoid(x) {
  return x * (1-x);
}



class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();
    this.learning_rate = 0.1;

  }

  feedforward(input_array) {
    //Generating hidden outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    //Activation F(n)
    hidden.map(sigmoid);

    //Generating output outputs
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    //Activation
    outputs.map(sigmoid);
    return outputs.toArray();

  }

  train (input_array, target_array) {
    //feedforward
    //Generating hidden outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    //Activation F(n)
    hidden.map(sigmoid);

    //Generating output outputs
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    //Activation
    outputs.map(sigmoid);

    //Coversion to matrix
    let targets = Matrix.fromArray(target_array);
    //Error calc
    let output_err = Matrix.subtract(targets, outputs)

    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_err);
    gradients.multiply(this.learning_rate);

    let hidden_t = Matrix.transpose(hidden);
    let weights_ho_delta = Matrix.multiply(gradients, hidden_t);
    //error.print();
    this.weights_ho.add(weights_ho_delta);
    this.bias_o.add(gradients);

    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_err = Matrix.multiply(who_t, output_err);

    let hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.multiply(hidden_err);
    hidden_gradient.multiply(this.learning_rate);

    let input_t = Matrix.transpose(inputs);
    let weights_ih_delta = Matrix.multiply(hidden_gradient, input_t);

    this.weights_ih.add(weights_ih_delta)
    this.bias_h.add(hidden_gradient);
  }

  predict(input_arr) {
    return this.feedforward(input_arr);
  }

  setLearningRate(num) {
    this.learning_rate = num;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    
  }

  copy() {
    return new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);
  }

  mutate(rate) {
    function mutate(val) {
      if (Math.random() < rate) {
        // return 2 * Math.random() - 1;
        return val + randomGaussian(0, 0.1);
      } else {
        return val;
      }
    }
    this.weights_ih.map(mutate);
    this.weights_ho.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
  }



}
