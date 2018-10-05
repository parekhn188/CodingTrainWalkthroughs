import processing.video.*;

Capture video;

color trackColor;
float threshold = 25;
float distThreshold = 25; 

ArrayList<Blob> blobs = new ArrayList<Blob>();

void setup() {
  size(640, 480);
  String[] cameras = Capture.list();
  printArray(cameras);
  video = new Capture(this, cameras[3]);
  video.start();
  trackColor = color(255, 255, 0);
}

void captureEvent(Capture video) {
  video.read();
}

void keyPressed() {
    if (key == 'a') {
       distThreshold++; 
    }else if (key == 'z') { 
       distThreshold--; 
    }
    println(distThreshold); 
}

void draw() {
  video.loadPixels();
  image(video, 0, 0);

  blobs.clear();


  threshold = 20;

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
        boolean found = false;
        for (Blob b: blobs) {
          if(b.isNear(x, y)){
            b.add(x,y);
            found = true;
            break; 
          }
        }
        if(!found) {
          Blob b = new Blob(x, y);
          blobs.add(b);
        }
      }
    }
  }
  for (Blob b: blobs) {
    if (b.size() > 500) { 
    b.show(); 
    }
  }
}

float distSq(float x1, float y1, float x2, float y2) {
  float d = pow((x2-x1), 2) + pow((y2-y1), 2);
  return d;
}

float distSq(float x1, float y1, float z1, float x2, float y2, float z2) {
  float d = pow((x2-x1), 2) + pow((y2-y1), 2) + pow((z2-z1), 2);
  return d;
}

void mousePressed() {
  int location = mouseX + mouseY*video.width; 
  trackColor = video.pixels[location]; 
}
