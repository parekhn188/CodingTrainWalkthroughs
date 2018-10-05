

import processing.video.*;

Capture video;

int blobCounter = 0; 
int maxLife = 200; 

color trackColor;
float threshold = 20;
float distThreshold = 90; 

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

  ArrayList<Blob> currentBlobs = new ArrayList<Blob>(); 


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
        for (Blob b: currentBlobs) {
          if(b.isNear(x,y)) {
            b.add(x,y);
            found = true;
            break; 
          }
        }
        if(!found) {
          Blob b = new Blob(x, y);
          currentBlobs.add(b);
        }
      }
    }
  } 
  
  for (int i = currentBlobs.size()-1; i >= 0; i--) {
    if (currentBlobs.get(i).size() < 500) { 
        currentBlobs.remove(i); 
    }
  }
  
  //Match currentBlobs with blobs 
  
  //No Blobs
  if (blobs.isEmpty() && currentBlobs.size() > 0) {
    println("adding blobs"); 
    for (Blob b : currentBlobs) { 
      b.id = blobCounter; 
      blobs.add(b);
      blobCounter++; 
    }
    //Equal or less Blobs
  } else if (blobs.size() <= currentBlobs.size()) {
    for (Blob b: blobs) {
       float recordD = 1000; 
       Blob matched = null; 
      for (Blob cb: currentBlobs) { 
        PVector centerB = b.getCenter(); 
        PVector centerCB = cb.getCenter(); 
        float d = PVector.dist(centerB, centerCB); 
        if (d < recordD && !cb.taken) {
          recordD = d; 
          matched = cb; 
        }
      }
      matched.taken = true; 
      b.become(matched);  
    }
    
    //Leftover new blobs
    for (Blob b : currentBlobs) { 
      if (!b.taken) { 
        b.id = blobCounter; 
        blobs.add(b); 
        blobCounter++; 
      }
    }
  } else if (blobs.size() > currentBlobs.size()) {
      
    for( Blob b : blobs) {
         b.taken = false; 
       }
       
    //Matching whatever blobs can be matched 
    for (Blob cb: currentBlobs) {
       float recordD = 1000; 
       Blob matched = null; 
       for (Blob b: blobs) {   
        PVector centerB = b.getCenter(); 
        PVector centerCB = cb.getCenter(); 
        float d = PVector.dist(centerB, centerCB); 
        if (d < recordD && !b.taken) {
          recordD = d; 
          matched = b; 
        }
      }
      if (matched != null){
      matched.taken = true; 
      matched.lifeSpan = maxLife; 
      matched.become(cb);  
      }   
    }
    for (int i = blobs.size() - 1; i >= 0; i--){ 
        Blob b = blobs.get(i); 
        if(!b.taken){
          if(b.checkSpan()){
            blobs.remove(i); 
        } 
      }
    }
  }
  
  for (Blob b: blobs) { 
    b.show(); 
  }
  
  textAlign(RIGHT); 
  textSize(32);
  fill(0);
  text(currentBlobs.size(), width-10, 40);
  text(blobs.size(), width-10, 80);
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
