class Blob {
  float minx;
  float miny;
  float maxx;
  float maxy;
  
  int lifeSpan = maxLife;
 
  
  ArrayList<PVector> points; 
  
  int id = 0; 
  boolean taken = false; 

  Blob(float x, float y) {
    points = new ArrayList<PVector>(); 
    minx = x;
    miny = y;
    maxx = x;
    maxy = y;
  }


  PVector getCenter() { 
    float xVal = (maxx - minx)*0.5 + minx; 
    float yVal = (maxy - miny)*0.5 + miny; 
    return new PVector(xVal, yVal); 
  }
  
  
  
  
  void become(Blob other) {
    minx = other.minx; 
    miny = other.miny; 
    maxx = other.maxx; 
    maxy = other.maxy;
  }

  void add(float x, float y) {
    minx  = min(minx, x);
    miny = min(miny, y);
    maxx = max(maxx, x);
    maxy = max(maxy, y);
  }

  boolean checkSpan() {
    lifeSpan --; 
    if (lifeSpan < 0) {
      return true; 
    } else {
    return false; 
    }
  }

  void show() {
    stroke(0);
    fill(255, lifeSpan);
    stroke(4);
    rectMode(CORNERS);
    rect(minx, miny, maxx, maxy);
    
    textAlign(CENTER); 
    textSize(64); 
    fill(0); 
    text(id, minx + (maxx-minx)*0.5, maxy-10); 
    //text(lifeSpan, minx + (maxx-minx)*0.5, miny-10); 
    }

  float size() {
    return (maxx - minx) * (maxy - miny); 
  }

  boolean isNear(float x, float y) {
    //Center distance
    float cx = (minx + maxx) / 2;
    float cy = (miny + maxy) /2;
    
    float d  = distSq(cx,cy,x,y);
    if (d < distThreshold * distThreshold) {
      return true;
    } else {
      return false;
    }
  }
}
