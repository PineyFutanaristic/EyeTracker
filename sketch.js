let video;
let posX;
let posY;
let examplesLimit = 100;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let counts;
function setup() {
  featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
  createCanvas(1280, 720);
  video = createCapture(VIDEO, videoLoaded);
  //console.log(video.size());
  video.size(600, 450)
  video.hide();
}

function draw() {
  //background(255);
  const counts = knnClassifier.getCountByLabel();
  image(video, 0, 0, video.width, video.height);
  //console.log(video.size());
  //background(220);
}
function keyPressed(){
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
  
function addExampleToModel(label){
  
  const features = featureExtractor.infer(video);
  knnClassifier.addExample(features, label);
  
}
function videoLoaded() {
  console.log("Video Loaded!");
}
function modelLoaded() {
  console.log("Model Loaded!");
}
