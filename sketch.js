let video;
let posX;
let posY;
let knn_const = 7;
let examplesLimit = 40;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let counts;
let predictionStatus = true;
let currentRes = "";
let pressed = 0;
function setup() {
  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  createCanvas(1280, 720);
  video = createCapture(VIDEO, videoLoaded);
  //console.log(video.size());
  video.size(600, 450)
  video.hide();
  frameRate(30);
}

function draw() {
  background(255);
  counts = knnClassifier.getCountByLabel();
  image(video, 0, 0, video.width, video.height);
  // let eye_view = video.get(220, 200, 140, 30);
  // image(eye_view, 0, 0, eye_view.width, eye_view.height);
  noFill();
  strokeWeight(4);
  stroke(255, 0, 0);
  rect(220, 200, 140, 30);
  strokeWeight(1);
  stroke('black');
  rect(400, 450, 140, 30);
  let exm = (counts["middle"] || 0);
  fill('red');
  rect(400, 450, 140*(pressed/examplesLimit)*(1/9), 30);
  //console.log(video.size());
  //background(220);
  //console.log("drawing");
  if(keyIsDown(32)){
    predictNow();
  }
  if(!keyIsDown(16)) {
    // if(keyIsDown(38)) knn_const ++;
    // if(keyIsDown(40)) knn_const --;
    // if(keyIsDown(71)) saveMyKNN();
    // if(keyIsDown(72)) loadMyKNN();
    if(keyIsDown(81)) addExampleToModel("top left");
    if(keyIsDown(87)) addExampleToModel("top");
    if(keyIsDown(69)) addExampleToModel("top right");
    if(keyIsDown(65)) addExampleToModel("left");
    if(keyIsDown(83)) addExampleToModel("middle");
    if(keyIsDown(68)) addExampleToModel("right");
    if(keyIsDown(90)) addExampleToModel("bottom left");
    if(keyIsDown(88)) addExampleToModel("bottom");
    if(keyIsDown(67)) addExampleToModel("bottom right");
  }
  else {
    if(keyIsDown(81)) resetLabel("top left");
    if(keyIsDown(87)) resetLabel("top");
    if(keyIsDown(69)) resetLabel("top right");
    if(keyIsDown(65)) resetLabel("left");
    if(keyIsDown(83)) resetLabel("middle");
    if(keyIsDown(68)) resetLabel("right");
    if(keyIsDown(90)) resetLabel("bottom left");
    if(keyIsDown(88)) resetLabel("bottom");
    if(keyIsDown(67)) resetLabel("bottom right");
  }
  textSize(32);
  fill('blue');
  stroke(random(255), random(255), random(255));
  if(!predictionStatus) currentRes = "";
  text("my prediction is " + currentRes, 0, 490);
  text("k = : " + knn_const, 0, 530);
}

function keyPressed(){
  if(keyCode == 38) knn_const ++;
  if(keyCode == 40) knn_const --;
  if(keyCode == 71) saveMyKNN();
  if(keyCode == 72) loadMYKNN();
}

function resetLabel(label){
  console.log("reset " + label);
  pressed -= ((counts[label] || 0));
  knnClassifier.clearLabel(label);
}

function gotResults(err, result){
  if(err) console.log(err);
  if(result.label){
    currentRes = result.label;
    //console.log("i'm working");
    console.log(result.label);
    //text("my prediction is " + result.label, 0, 0);
  }
  predictNow();
}

function predictNow(){
  const features = featureExtractor.infer(video);
  knnClassifier.classify(features, knn_const, gotResults);
}

function saveMyKNN() {
  knnClassifier.save('myKNNDataset');
}

function loadMyKNN() {
  knnClassifier.load('./myKNNDataset.json', updateCounts);
}

function addExampleToModel(label){
  //console.log("adding " + label);
  if((counts[label] || 0) < examplesLimit){
    if(counts[label] == examplesLimit - 1) console.log(label + " exceeded");
    pressed += 1;
    //console.log("adding " + label);
    const features = featureExtractor.infer(video);
    knnClassifier.addExample(features, label);
  }
}

function videoLoaded() {
  console.log("Video Loaded!");
}
function modelLoaded() {
  console.log("Model Loaded!");
}
