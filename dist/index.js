class ImageGallery {
    constructor(images) {
        this.imageList = null;
        this.mainImgTitle = null;
        this.mainImgDescription = null;
        this.imagesInList = [];
        this.imgPerPage = 5;
        this.images = images;
        this.mainImage = document.getElementById("mainImage");
        this.mainImgTitle = document.getElementById("mainImgTitle");
        this.mainImgDescription = document.getElementById("mainImgDescription");
    }
    initArrows() {
        let leftArrow = document.getElementById("leftArrow");
        let rightArrow = document.getElementById("rightArrow");
        leftArrow === null || leftArrow === void 0 ? void 0 : leftArrow.addEventListener('click', (event) => {
            this.goDirection(-1);
            event.stopPropagation();
        });
        rightArrow === null || rightArrow === void 0 ? void 0 : rightArrow.addEventListener('click', (event) => {
            this.goDirection(1);
            event.stopPropagation();
        });
    }
    goDirection(direction) {
        let nextMainElement;
        let currentHighlightedImage = document.querySelector('#imageList picture:not(.opacity-70)');
        if (direction == 1) {
            nextMainElement = (currentHighlightedImage === null || currentHighlightedImage === void 0 ? void 0 : currentHighlightedImage.nextElementSibling) ? currentHighlightedImage.nextElementSibling : this.imagesInList[0];
        }
        else {
            nextMainElement = (currentHighlightedImage === null || currentHighlightedImage === void 0 ? void 0 : currentHighlightedImage.previousElementSibling) ? currentHighlightedImage.previousElementSibling : this.imagesInList[this.imagesInList.length - 1];
        }
        this.displayAsMain(nextMainElement, null);
        this.highLightImageInList(nextMainElement, true);
        this.checkIfLineShouldShift(nextMainElement);
    }
    setImgList() {
        this.imagesInList.forEach((img, index) => {
            if (index < this.imgPerPage) {
                img[0].classList.add("active");
            }
            else {
                img[0].classList.remove("active");
            }
        });
    }
    initMainImg() {
        if (this.mainImage) {
            this.images[1].createImgElement(this.mainImage, this.images[1].fileName);
            if (this.images[1].title && this.mainImgTitle)
                this.mainImgTitle.innerHTML = this.images[1].title;
            if (this.images[1].description && this.mainImgDescription)
                this.mainImgDescription.innerHTML = this.images[1].description;
        }
    }
    initImgList() {
        this.imageList = document.getElementById("imageList");
        if (this.imageList) {
            this.imageList.addEventListener("transitionend", () => {
                var _a;
                const newPosition = (_a = this.imageList) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
                if (newPosition && this.imageList) {
                    this.imageList.style.left = newPosition.left + "px";
                    this.imageList.style.top = newPosition.top + "px";
                }
            });
        }
        if (this.imageList) {
            this.images.forEach(image => {
                let imgPictureElement = image.createImgElement(this.imageList, image.fileName);
                imgPictureElement.classList.add("listImg", "opacity-70");
                this.imagesInList.push([imgPictureElement,
                    {
                        imageTitle: image.title,
                        imageDescription: image.description,
                        imageDate: image.date
                    }
                ]);
                imgPictureElement.addEventListener('click', () => {
                    this.displayAsMain(imgPictureElement, image);
                    this.highLightImageInList(imgPictureElement, false);
                    this.checkIfLineShouldShift(imgPictureElement);
                });
            });
            this.highLightImageInList(this.imagesInList[1][0], false);
            this.setImgList();
        }
    }
    checkIfLineShouldShift(imagePictureElement) {
        const firstInList = document.querySelector('.active');
        const lastInList = Array.from(document.querySelectorAll('.active')).pop();
        let imgWidth = this.imgPerPage == 3 ? 115 : 176;
        let translateValue = (this.imgPerPage - 2) * (imgWidth + 16);
        this.imageList.style.transition = "transform .3s ease-in-out";
        if (imagePictureElement == lastInList) {
            this.shiftLine(true, translateValue);
        }
        if (imagePictureElement == firstInList) {
            this.shiftLine(false, translateValue);
        }
    }
    shiftLine(isGoingRight, translateValue) {
        if (!isGoingRight) {
            this.recalculateImgList(this.imgPerPage - 2, false);
            this.imageList.style.transition = "transform 0s";
            this.imageList.style.transform = "translateX(-" + translateValue.toString() + "px)";
            setTimeout(() => {
                this.imageList.style.transition = "transform .3s ease-in-out";
                this.imageList.style.transform = "translateX(0)";
                this.setImgList();
            }, 50);
        }
        else {
            this.imageList.style.transform = "translateX(" + (isGoingRight ? "-" : "") + translateValue.toString() + "px)";
            setTimeout(() => {
                this.recalculateImgList(this.imgPerPage - 2, isGoingRight);
                this.setImgList();
            }, 300);
        }
    }
    recalculateImgList(imgsToMove, isGoingRight) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (isGoingRight) {
            for (let index = 0; index < imgsToMove; index++) {
                const firstPicture = (_a = this.imageList) === null || _a === void 0 ? void 0 : _a.querySelector('#imageList picture:first-child');
                const tempElement = this.imagesInList.shift();
                if (firstPicture && tempElement) {
                    this.imagesInList.push(tempElement);
                    (_b = this.imageList) === null || _b === void 0 ? void 0 : _b.removeChild(firstPicture);
                    (_c = this.imageList) === null || _c === void 0 ? void 0 : _c.appendChild(firstPicture);
                }
            }
            this.imageList.style.transition = "transform 0s";
            this.imageList.style.transform = "translateX(0)";
        }
        else {
            for (let index = 0; index < imgsToMove; index++) {
                const firstPicture = (_d = this.imageList) === null || _d === void 0 ? void 0 : _d.querySelector('#imageList picture:last-child');
                const tempElement = this.imagesInList.pop();
                if (firstPicture && tempElement) {
                    this.imagesInList.unshift(tempElement);
                    (_e = this.imageList) === null || _e === void 0 ? void 0 : _e.removeChild(firstPicture);
                    (_f = this.imageList) === null || _f === void 0 ? void 0 : _f.insertBefore(firstPicture, (_g = this.imageList) === null || _g === void 0 ? void 0 : _g.firstChild);
                }
            }
        }
    }
    displayAsMain(imagePictureElement, image) {
        if (this.mainImage) {
            this.mainImage.getElementsByTagName("source")[0].srcset = imagePictureElement.getElementsByTagName('img')[0].src;
            this.mainImage.getElementsByTagName("img")[0].src = imagePictureElement.getElementsByTagName('img')[0].src;
            if (image === null || image === void 0 ? void 0 : image.title) {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = image.title;
            }
            else {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = '';
            }
            if (image === null || image === void 0 ? void 0 : image.description) {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = image.description;
            }
            else {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = '';
            }
        }
    }
    highLightImageInList(img, fromArrows) {
        this.imagesInList.forEach(image => {
            image[0].classList.add("opacity-70");
        });
        img.classList.remove("opacity-70");
        if (!fromArrows)
            return;
        let imgClass = this.imagesInList.find(imageList => {
            return imageList.some(item => item === img);
        });
        if (imgClass) {
            if (imgClass[1].imageTitle) {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = imgClass[1].imageTitle;
            }
            else {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = '';
            }
            if (imgClass[1].imageDescription) {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = imgClass[1].imageDescription;
            }
            else {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = '';
            }
        }
    }
    setImgPerPage() {
        if (window.innerWidth < 820) {
            if (this.imgPerPage != 3) {
                this.imgPerPage = 3;
                this.setImgList();
            }
        }
        else if (window.innerWidth < 1155) {
            if (this.imgPerPage != 4) {
                this.imgPerPage = 4;
                this.setImgList();
            }
        }
        else if (window.innerWidth < 1355) {
            if (this.imgPerPage != 4) {
                this.imgPerPage = 4;
                this.setImgList();
            }
        }
        else {
            if (this.imgPerPage != 5) {
                this.imgPerPage = 5;
                this.setImgList();
            }
        }
    }
}
import { ImageClass } from "./image.js";
document.addEventListener("DOMContentLoaded", () => {
    let imageGallery = new ImageGallery([
        new ImageClass("cat1.jpg", "cat1 Title", "cat 1 description", new Date()),
        new ImageClass("cat2.jpg", "cat2 Title", "cat 2 description", new Date()),
        new ImageClass("cat3.jpg", "cat3 Title", "cat 3 description", new Date()),
        new ImageClass("cat4.jpg"),
        new ImageClass("cat5.jpg"),
        new ImageClass("cat6.jpg"),
        new ImageClass("cat7.jpg"),
        new ImageClass("cat8.jpg"),
        new ImageClass("cat9.jpg"),
        new ImageClass("cat10.jpg"),
        new ImageClass("cat11.jpg")
    ]);
    imageGallery.initArrows();
    imageGallery.initMainImg();
    imageGallery.initImgList();
    window.addEventListener('resize', () => {
        imageGallery.setImgPerPage();
    });
});
