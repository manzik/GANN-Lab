## GANN Lab: Experiment showing agents navigating through user-created world using Genetic Algorithm + Artificial Neural Networks
This project is a demonstration of how agents controlled using artificial neural networks can learn to survive in a virtual programmed world through generations using genetic algorithm.

You can **access the project at [https://github.mohsenyousefian.com/GANN-Lab/](https://github.mohsenyousefian.com/GANN-Lab/)**  
  
![Demo GIF of the project](https://github.com/manzik/GANN-Lab/blob/master/img/demo.gif)

Introductory resources:
 - Artificial neural networks: https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi
 - Genetic Algorithm: https://towardsdatascience.com/introduction-to-genetic-algorithms-including-example-code-e396e98d8bf3

You can find sample codes used to test these algorithms in this project in Javascript and Python at [genetic-algorithm-samples](https://github.com/manzik/GANN-Lab/tree/master/gann-samples/).

## Overview of the world and the agents
Each agent consists of weights for a fully connected feedforward ANN (artificial neural network) encoded as a set of genes in the individual's chromosome. The ANN's input is a set of distances from the closest collision from each sensor as input, and the ANN will make a decision based on the weights defined in that individual's genes, and produce an output for decisions on turns to make and acceleration in each frame.  

The population starts with random weights (genes) resembling no knowledge. And genetic algorithm is applied to the weights in the ANN to produce a better performing population of individuals each generation.  

![Overview of the individuals and how they interact with the world](https://github.com/manzik/GANN-Lab/blob/master/img/individuals.png?raw=true)
## Genetic Algorithm

### **Overview**

### Fitness function
In order to have a fitness function avoiding extra parameters like destination point, the implemented fitness function's goal is to promote curiosity.  
The world is split into grid cells with equal size. Each cell in this grid called `curiosity grid` hold a flag of whether it has been explored or not. When an agent passes a cell, it gets flagged as explored only once.  
The final score of each agent would be the number of cells that have been explored by that agent.

You can see the visualization of an agent trying to improve its score below:
![Visualization of curiosity grid](https://github.com/manzik/GANN-Lab/blob/master/img/curiosity-grid.gif?raw=true)
### Crossover
Crossover is usually implemented under the assumption that performing the crossover operation would result in children that have the features of both parents.  
But in artificial neural networks, two completely different sets of weights could have the same behaviour and performing a crossover will result in completely dysfunctional offsprings that do not resemble any of the behavioural features of its parents despite having good-performing parents, and is not beneficial in case of ANNs.  
Therefore, this step is skipped in this implementation of genetic algorithm.
### Mutation
In the mutation step, instead of mutating using a uniform probability distribution, genes (ANN weights) are changed randomly using a gaussian distribution.  
This allows the next generation to fine-tune the weights easier by having more probability for small changes to the weights and less probability for extreme changes to the weights.  
Furthermore, weight clipping is done to make sure that weights for the ANN remain in the range (-1, 1).
## Artificial Neural Network
### Architecture
The neural network's number of hidden layers and the number of neurons in each layer is customizable.  
The functions ReLU, sigmoid and tanh are available as possible activation functions.  
### Inputs
The inputs are distances of the sensors (each at a different angle) from the closest obstacle divided by the max detectable distance so that the value would be between 0 and 1.  
In addition to sensory inputs, there are 2 input neurons:
1. Whether the individual's current cell has been previously explored or not.
2. The individual's current speed.
### Outputs
There are three outputs in the final layer of the neural network.  
2 neurons correspond to the right and left turn preference. The turn is then determined as _Left turn_ value subtracted from _right turn_ value.  
And the other neuron corresponds to the acceleration of the individual.
## Interesting Notes and Readings
1. In this project, the neural network weights were directly encoded inside the genes, and the learning was done only using genetic algorithm. And each individual does not learn during its interaction with the environment.  
Geoffrey Hinton, a year after publishing his paper on backpropagation algorithm with his co-authors, published a paper on how learning of each individual in the population (besides from genetic algorithm) can direct the evolutionary path and improve it drastically: [Hinton, G. E., & Nowlan, S. J. (1987). How learning can guide evolution. Complex systems, 1(3), 495-502.](http://www.complex-systems.com/pdf/01-3-6.pdf)

2. In this project, the crossover step was skipped. A better alternative to this approach for this step and some of the other steps of genetic algorithm for usage with neural networks is described in the paper for the NEAT algorithm: [Stanley, K., & Miikkulainen, R. (2002). Evolving Neural Networks through Augmenting Topologies. Evolutionary Computation, 10(2), 99-127. doi: 10.1162/10636560232016981](http://doi.org/10.1162/106365602320169811)
