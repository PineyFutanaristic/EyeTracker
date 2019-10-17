let video;
let posX;
let posY;
const knn_const = 3;
let examplesLimit = 10;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let counts;
let predictionStatus = true;
let currentRes = "";
function setup() {
  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  createCanvas(1280, 720);
  video = createCapture(VIDEO, videoLoaded);
  //console.log(video.size());
  video.size(600, 450)
  video.hide();
}

function draw() {
  background(255);
  counts = knnClassifier.getCountByLabel();
  image(video, 0, 0, video.width, video.height);
  //console.log(video.size());
  //background(220);
  console.log("drawing");
  textSize(32);
  fill('blue');
  text("my prediction is " + currentRes, 0, 490);
}

function keyPressed(){
  if(keyCode == 32){
    predictNow();
  }
  if(keyCode != 16) {
    if(keyCode == 81) addExampleToModel("top left");
    if(keyCode == 87) addExampleToModel("top");
    if(keyCode == 69) addExampleToModel("top right");
    if(keyCode == 65) addExampleToModel("left");
    if(keyCode == 83) addExampleToModel("middle");
    if(keyCode == 68) addExampleToModel("right");
    if(keyCode == 90) addExampleToModel("bottom left");
    if(keyCode == 88) addExampleToModel("bottom");
    if(keyCode == 67) addExampleToModel("bottom right");
  }
  else {
    if(keyCode == 81) resetLabel("top left");
    if(keyCode == 87) resetLabel("top");
    if(keyCode == 69) resetLabel("top right");
    if(keyCode == 65) resetLabel("left");
    if(keyCode == 83) resetLabel("middle");
    if(keyCode == 68) resetLabel("right");
    if(keyCode == 90) resetLabel("bottom left");
    if(keyCode == 88) resetLabel("bottom");
    if(keyCode == 67) resetLabel("bottom right");
  }
}

function resetLabel(label){
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
function flipPredict(){
  const numLabels = knnClassifier.getNumLabels();
  if(predictionStatus == false){
    if(numLabels > 0) predictionStatus = true;
  }
  else{
    predictionStatus = false;
  }
}

function addExampleToModel(label){
  console.log("adding " + label);
  if((counts[label] || 0) < examplesLimit){
    if(counts[label] == examplesLimit - 1) console.log(label + " exceeded");
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
