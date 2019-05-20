import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface item {
  imagePath?: string;
  audioPath?: string;
  name?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  private countrycollectionFile = "./assets/country/countries.json"
  title = 'playschool';
  pathPrefix = "assets/country/";  
  currentIndex = 0;
  currentItem:any = {name:"Afghanistan"};
  itemCollection: item[] = [];
  currentImage="";

  constructor(private http: HttpClient) {
    this.getCountry().subscribe(data => {
      this.itemCollection = data;
      this.currentItem = this.itemCollection[this.currentIndex];
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/itemCollection.json");
  }

  public getCountry(): Observable<any> {
    return this.http.get(this.countrycollectionFile);
  }

  speak(text: string) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[0];
    msg.rate = 0.75;
    msg.pitch = 1;
    msg.text = text;
    speechSynthesis.speak(msg);
  }

  clickPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.processItem();
    }
  }

  clickNext() {
    if (this.currentIndex <= this.itemCollection.length - 1) {
      this.currentIndex++;
      this.processItem();
    }
  }

  processItem() {
    this.currentItem = this.itemCollection[this.currentIndex];
    if (this.currentItem.imagePath) {
      this.currentImage = this.pathPrefix + this.currentItem.imagePath;  
    }else{
      this.currentImage = "";
    }
    
    if (this.currentItem.audioPath) {
      let audio = new Audio(this.pathPrefix + this.currentItem.audioPath);
      audio.play();
    } else if (this.currentItem.name) {
      this.speak(this.currentItem.name);
    }
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        // Do whatever you want with swipe
        if (swipe === 'next') {
          this.clickNext();
        } else if (swipe === 'previous') {
          this.clickPrev();
        }
      }
    }
  }
}
