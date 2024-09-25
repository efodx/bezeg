import JSZip from "jszip";
import {wait} from "@testing-library/user-event/dist/utils";

class ImageStoreSingleton {
    storedImages: Blob[] = [];
    imageNames: string[] = [];
    numOfImages: number = 0;

    creatingImage() {
        this.numOfImages += 1;
    }

    addImage(blob: Blob, name: string) {
        this.storedImages.push(blob);
        this.imageNames.push(name);
    }

    clear() {
        this.storedImages = [];
        this.imageNames = [];
        this.numOfImages = 0;
    }

    createZip() {
        // TODO Fix this lol, this aint how u program m8
        if (this.numOfImages != this.imageNames.length) {
            wait(100).then(() => this.createZip());
            return;
        }

        const zip = new JSZip();
        const clear = () => this.clear();
        console.log(this.imageNames);
        this.storedImages.forEach(((blob, i) => zip.file(this.imageNames[i] + '.png', blob)));
        zip.generateAsync({type: "blob"}).then(function (content) {
            const link = document.createElement('a');
            link.download = 'slike.zip';
            link.href = window.URL.createObjectURL(content);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            clear();
        });
    }
}

export const ImageStore = new ImageStoreSingleton();