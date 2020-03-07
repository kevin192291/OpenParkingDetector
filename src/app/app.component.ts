import { Component } from '@angular/core';
declare var tmImage;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  URL = "./";
  model;
  webcam;
  labelContainer;
  maxPredictions;

  constructor() {

  }

    async init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        this.model = await tmImage.load(modelURL, metadataURL);
        this.maxPredictions = this.model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        this.webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await this.webcam.setup(); // request access to the webcam
        await this.webcam.play();
        window.requestAnimationFrame(this.loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(this.webcam.canvas);
        this.labelContainer = document.getElementById("label-container");
        for (let i = 0; i < this.maxPredictions; i++) { // and class labels
            this.labelContainer.appendChild(document.createElement("div"));
        }
    }

    async loop() {
        this.webcam.update(); // update the webcam frame
        await this.predict();
        window.requestAnimationFrame(this.loop);
    }

    // run the webcam image through the image model
    async predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await this.model.predict(this.webcam.canvas);
        for (let i = 0; i < this.maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            this.labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }

}
