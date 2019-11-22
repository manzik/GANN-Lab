# Sample files

## Codes
You can find the early codes I wrote to test performance and functionality for `genetic algorithm` and `genetic algorithm + artificial neural networks` here.  
The codes are run and tested using [node.js](https://nodejs.org/en/)
 - GA.ipynb: Genetic algorithm code written in python. In this GA, fitness function has positive score for first half of the genes and negative for the second half.  
 - GA.js: Genetic algorithm code translated from python to javascript.
 - GANN.js: Artificial neural networks added to GA.js In this GA, gaol is to minimize artificial neural network's output squared error from this simple formula based on x<sub>1</sub> and x<sub>2</sub>: ![s](http://www.sciweavers.org/tex2img.php?eq=y%20%3D%20-1%20%5Ctimes%20x_1%20%2B%202%20%5Ctimes%20x_2&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0). Note that unlike the backpropagation algorithm, the genetic algorithm does not use the right answer directly to tune the weights.
## Outputs
**GA.ipynb**
```
First generation best chromosome score: 57
First generation best chromosome genes: [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1]
Improvement in generation #1 best chromosome score: 60
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0]
Improvement in generation #2 best chromosome score: 61
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0]
Improvement in generation #6 best chromosome score: 62
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0]
Improvement in generation #10 best chromosome score: 63
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0]
Improvement in generation #14 best chromosome score: 64
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0]
Improvement in generation #17 best chromosome score: 65
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0]
Improvement in generation #21 best chromosome score: 66
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
Improvement in generation #24 best chromosome score: 67
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0]
Improvement in generation #27 best chromosome score: 68
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
Improvement in generation #32 best chromosome score: 70
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
Improvement in generation #37 best chromosome score: 71
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
Improvement in generation #47 best chromosome score: 72
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
Improvement in generation #57 best chromosome score: 73
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
Improvement in generation #62 best chromosome score: 74
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Improvement in generation #74 best chromosome score: 75
New generation best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Done
Best chromosome genes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```
**GA.js**
```
First generation best chromosome score: 60
First generation best chromosome genes: 0,1,1,1,1,1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,0,1,0,0,0,1,0
Improvement in generation #1 best chromosome score: 61
New generation best chromosome genes: 0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0
Improvement in generation #4 best chromosome score: 62
New generation best chromosome genes: 0,0,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0
Improvement in generation #5 best chromosome score: 65
New generation best chromosome genes: 1,1,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,0,1,0,0,0,1,0
Improvement in generation #11 best chromosome score: 66
New generation best chromosome genes: 1,1,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0
Improvement in generation #14 best chromosome score: 67
New generation best chromosome genes: 0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0
Improvement in generation #15 best chromosome score: 68
New generation best chromosome genes: 0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Improvement in generation #17 best chromosome score: 69
New generation best chromosome genes: 1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Improvement in generation #21 best chromosome score: 70
New generation best chromosome genes: 1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Improvement in generation #24 best chromosome score: 71
New generation best chromosome genes: 1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Improvement in generation #25 best chromosome score: 72
New generation best chromosome genes: 1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Improvement in generation #28 best chromosome score: 74
New generation best chromosome genes: 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Improvement in generation #29 best chromosome score: 75
New generation best chromosome genes: 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
```

**GANN.js**
```
0/1000
100/1000
200/1000
300/1000
400/1000
500/1000
600/1000
700/1000
800/1000
900/1000
Best chromosome genes (weights): [ -0.8280416522015102,
  1.6558888141758616,
  0.9777394861960601,
  -1.6853615709241538,
  1.2320227555702867,
  -1.9398656682313367,
  -0.7634849821223848,
  -1.3496136406579038,
  -0.7656658603462255,
  1.0384680651085958,
  -1.8325897099698005,
  0.11894144264432363,
  -1.7072537445746294,
  0.26054261368856485,
  0.22940021578099745,
  -0.8015670088643808,
  1.1630988018179953,
  -2.0533556635134893 ]
inputs: [ 0.23182538751375503, -0.992886328867816 ] predicted: [ -2.058284972580344 ] ground truth: [ -2.217598045249387 ]
Squared error: 0.02538065512325186
inputs: [ 0.5050627328708419, 0.9290184458206818 ] predicted: [ 1.3529488892832717 ] ground truth: [ 1.3529741587705217 ]
Squared error: 6.385469858785466e-10
inputs: [ -0.5395240785811475, -0.12296051886018855 ] predicted: [ 0.2936738013393689 ] ground truth: [ 0.2936030408607704 ]
Squared error: 5.007045331488382e-9
inputs: [ -0.5114939267293717, 0.1976722997821283 ] predicted: [ 0.9069214291835448 ] ground truth: [ 0.9068385262936283 ]
Squared error: 6.8728891565114905e-9
inputs: [ -0.0880152928512854, 0.9086038574282522 ] predicted: [ 1.905281298912234 ] ground truth: [ 1.9052230077077899 ]
Squared error: 3.3978645155587184e-9
inputs: [ -0.8052598775138304, -0.6678819633227784 ] predicted: [ -0.32394170828070173 ] ground truth: [ -0.5305040491317263 ]
Squared error: 0.042668000657854865
inputs: [ -0.7916297787257771, 0.9920579978024606 ] predicted: [ 2.7759086202147256 ] ground truth: [ 2.7757457743306984 ]
Squared error: 2.6518781944620742e-8
inputs: [ 0.757057202101425, 0.6633370721736185 ] predicted: [ 0.5695423577451136 ] ground truth: [ 0.5696169422458119 ]
Squared error: 5.562847744415429e-9
inputs: [ -0.2595700061034947, 0.7823482121373577 ] predicted: [ 1.8243428341969752 ] ground truth: [ 1.8242664303782101 ]
Squared error: 5.837543521883893e-9
inputs: [ -0.10423282437065717, -0.026908404982299405 ] predicted: [ 0.05042952618081678 ] ground truth: [ 0.05041601440605836 ]
Squared error: 1.8256805712221953e-10
inputs: [ -0.396757186080245, -0.8930223662027155 ] predicted: [ -1.1834076543693046 ] ground truth: [ -1.389287546325186 ]
Squared error: 0.04238652991176536
inputs: [ 0.011240425949578636, -0.19630764309936444 ] predicted: [ -0.368779833078576 ] ground truth: [ -0.4038557121483075 ]
Squared error: 0.0012303172925144305
inputs: [ -0.8451201232488899, 0.9320313275873753 ] predicted: [ 2.7093502317560185 ] ground truth: [ 2.7091827784236404 ]
Squared error: 2.8040618524533484e-8
inputs: [ 0.5219219045382024, -0.835244365163403 ] predicted: [ -2.0921969952919683 ] ground truth: [ -2.1924106348650083 ]
Squared error: 0.010042773556475162
inputs: [ -0.8922013455211517, -0.09658134400055474 ] predicted: [ 0.6991610468333626 ] ground truth: [ 0.6990386575200422 ]
Squared error: 1.4979144015018153e-8
inputs: [ -0.23771953592010941, 0.5589123878025601 ] predicted: [ 1.355606351430329 ] ground truth: [ 1.3555443115252297 ]
Squared error: 3.848949824721653e-9
inputs: [ 0.4183613501182464, -0.4207609948080302 ] predicted: [ -1.225473850354971 ] ground truth: [ -1.2598833397343068 ]
Squared error: 0.001184012959346627
inputs: [ 0.43006148273583555, 0.6850665872181381 ] predicted: [ 0.9400448391207042 ] ground truth: [ 0.9400716917004406 ]
Squared error: 7.210610384962907e-10
inputs: [ 0.9831099230912965, 0.8301225236945826 ] predicted: [ 0.6770366945687581 ] ground truth: [ 0.6771351242978687 ]
Squared error: 9.688411572778359e-9
inputs: [ -0.2885638660478551, 0.6082824175500274 ] predicted: [ 1.5052004779986097 ] ground truth: [ 1.50512870114791 ]
Squared error: 5.151916296367131e-9
Mean squared error over 20 samples: 0.006144620297469841
```
