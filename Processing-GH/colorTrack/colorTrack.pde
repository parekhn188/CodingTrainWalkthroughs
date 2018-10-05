import processing.video.*;

Capture video;

color trackColor;
float threshold = 25;

void setup() {
  size(640, 480);
  String[] cameras = Capture.list();
  printArray(cameras);
  video = new Capture(this, cameras[3]);
  video.start();
  trackColor = color(255, 0, 0);
}

void captureEvent(Capture video) {
  video.read();
}

void draw() {
  video.loadPixels();
  image(video, 0, 0);

  threshold = 20;

  float avgX = 0;
  float avgY = 0;

  int count = 0;

  for(int x=0; x < video.width; x++) {
    for(int y=0; y < video.height; y++){
      int location = x + y * video.width;

      color currentColor = video.pixels[location];
      float r1 = red(currentColor);
      float g1 = green(currentColor);
      float b1 = blue(currentColor);
      float r2 = red(trackColor);
      float g2 = green(trackColor);
      float b2 = blue(trackColor);

      float d = distSq(r1,g1,b1,r2,g2,b2);

      if (d < threshold*threshold) {
        avgX += x;
        avgY += y;
        count++;
      }
    }
  }

  if (count > 0) {
    avgX = avgX / count;
    avgY = avgY / count;

    //Draw circle at tracked pixel
    fill(trackColor);
    strokeWeight(4.0);
    stroke(0);
    ellipse(avgX, avgY, 24, 24);
  }
}

float distSq(float x1, float y1, float z1, float x2, float y2, float z2) { 
  float d = pow((x2-x1), 2) + pow((y2-y1), 2) + pow((z2-z1), 2); 
  return d;
}

void mousePressed() {
  int location = mouseX + mouseY*video.width; 
  trackColor = video.pixels[location]; 
}
