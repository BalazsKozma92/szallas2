export class ImageClass {
    constructor(fileName, title = null, description = null, date = null) {
        this.fileName = fileName;
        this.title = title;
        this.description = description;
        this.date = date;
    }
    createImgElement(elementToAppend, imageName) {
        const pic = document.createElement("picture");
        if (elementToAppend) {
            const source = document.createElement("source");
            source.srcset = `./src/img/gallery/${imageName}`;
            source.type = "image/webp";
            const img = document.createElement("img");
            img.src = `./src/img/gallery/${imageName}`;
            pic === null || pic === void 0 ? void 0 : pic.appendChild(source);
            pic === null || pic === void 0 ? void 0 : pic.appendChild(img);
            elementToAppend === null || elementToAppend === void 0 ? void 0 : elementToAppend.appendChild(pic);
        }
        return pic;
    }
}
