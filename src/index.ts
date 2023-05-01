class ImageGallery {

    images: ImageClass[]
    imageList: HTMLElement | null = null

    mainImage: HTMLElement | null
    mainImgTitle: HTMLElement | null = null
    mainImgDescription: HTMLElement | null = null
    imagesInList: any[][] = []

    imgPerPage: number = 5

    constructor(images: ImageClass[]) {
        this.images = images
        this.mainImage = document.getElementById("mainImage");
        this.mainImgTitle = document.getElementById("mainImgTitle")
        this.mainImgDescription = document.getElementById("mainImgDescription")
    }

    public initArrows() {
        let leftArrow = document.getElementById("leftArrow")
        let rightArrow = document.getElementById("rightArrow")

        leftArrow?.addEventListener('click', (event) => {
            this.goDirection(-1)
            event.stopPropagation()
        })
        rightArrow?.addEventListener('click', (event) => {
            this.goDirection(1)
            event.stopPropagation()
        })
    }

    private goDirection(direction: -1 | 1) {
        let nextMainElement: any

        let currentHighlightedImage: HTMLElement | null = document.querySelector('#imageList picture:not(.opacity-70)');

        if (direction == 1) {
            nextMainElement = currentHighlightedImage?.nextElementSibling ? currentHighlightedImage.nextElementSibling : this.imagesInList[0]
        } else {
            nextMainElement = currentHighlightedImage?.previousElementSibling ? currentHighlightedImage.previousElementSibling : this.imagesInList[this.imagesInList.length - 1]
        }

        this.displayAsMain(nextMainElement, null)
        this.highLightImageInList(nextMainElement, true)
        this.checkIfLineShouldShift(nextMainElement)
    }

    private setImgList(): void {
        this.imagesInList.forEach((img, index) => {
            if (index < this.imgPerPage) {
                img[0].classList.add("active")
            } else {
                img[0].classList.remove("active")
            }
        });
    }

    public initMainImg(): void {
        if (this.mainImage) {
            this.images[1].createImgElement(this.mainImage, this.images[1].fileName)
            if (this.images[1].title && this.mainImgTitle)
                this.mainImgTitle.innerHTML = this.images[1].title
            if (this.images[1].description && this.mainImgDescription)
                this.mainImgDescription.innerHTML = this.images[1].description
        }
    }

    public initImgList(): void {
        this.imageList = document.getElementById("imageList");

        if (this.imageList) {
            this.imageList.addEventListener("transitionend", () => {
                const newPosition = this.imageList?.getBoundingClientRect();

                if (newPosition && this.imageList) {
                    this.imageList.style.left = newPosition.left + "px";
                    this.imageList.style.top = newPosition.top + "px";
                }
            });
        }

        if (this.imageList) {
            this.images.forEach(image => {
                let imgPictureElement = image.createImgElement(this.imageList, image.fileName)
                imgPictureElement.classList.add("listImg", "opacity-70")

                this.imagesInList.push([imgPictureElement,
                    {
                        imageTitle: image.title,
                        imageDescription: image.description,
                        imageDate: image.date
                    }
                ])
                imgPictureElement.addEventListener('click', () => {
                    this.displayAsMain(imgPictureElement, image)
                    this.highLightImageInList(imgPictureElement, false)
                    this.checkIfLineShouldShift(imgPictureElement)
                })
            })

            this.highLightImageInList(this.imagesInList[1][0], false)

            this.setImgList()
        }
    }

    private checkIfLineShouldShift(imagePictureElement: HTMLElement) {
        const firstInList = document.querySelector('.active')
        const lastInList = Array.from(
            document.querySelectorAll('.active')
        ).pop();

        let imgWidth = this.imgPerPage == 3 ? 115 : 176
        let translateValue = (this.imgPerPage - 2) * (imgWidth + 16)
        this.imageList!.style.transition = "transform .3s ease-in-out"

        if (imagePictureElement == lastInList) {
            this.shiftLine(true, translateValue)
        }
        if (imagePictureElement == firstInList) {
            this.shiftLine(false, translateValue)
        }
    }

    private shiftLine(isGoingRight: boolean, translateValue: number) {
        if (!isGoingRight) {
            this.recalculateImgList(this.imgPerPage - 2, false)
            this.imageList!.style.transition = "transform 0s"
            this.imageList!.style.transform = "translateX(-" + translateValue.toString() + "px)";
            setTimeout(() => {
                this.imageList!.style.transition = "transform .3s ease-in-out"
                this.imageList!.style.transform = "translateX(0)";
                this.setImgList()
            }, 50);
        } else {
            this.imageList!.style.transform = "translateX(" + (isGoingRight ? "-" : "") + translateValue.toString() + "px)";

            setTimeout(() => {
                this.recalculateImgList(this.imgPerPage - 2, isGoingRight)
                this.setImgList()
            }, 300);
        }

    }

    private recalculateImgList(imgsToMove: number, isGoingRight: boolean) {
        if (isGoingRight) {
            for (let index = 0; index < imgsToMove; index++) {
                const firstPicture = this.imageList?.querySelector('#imageList picture:first-child') as HTMLElement | null;
                const tempElement: any[] | undefined = this.imagesInList.shift()

                if (firstPicture && tempElement) {
                    this.imagesInList.push(tempElement)

                    this.imageList?.removeChild(firstPicture)
                    this.imageList?.appendChild(firstPicture)
                }
            }
            this.imageList!.style.transition = "transform 0s"
            this.imageList!.style.transform = "translateX(0)";
        } else {
            for (let index = 0; index < imgsToMove; index++) {
                const firstPicture = this.imageList?.querySelector('#imageList picture:last-child') as HTMLElement | null;
                const tempElement: any[] | undefined = this.imagesInList.pop()

                if (firstPicture && tempElement) {
                    this.imagesInList.unshift(tempElement)

                    this.imageList?.removeChild(firstPicture)
                    this.imageList?.insertBefore(firstPicture, this.imageList?.firstChild)
                }
            }
        }
    }

    private displayAsMain(imagePictureElement: HTMLElement, image: ImageClass | null) {
        if (this.mainImage) {
            this.mainImage.getElementsByTagName("source")[0].srcset = imagePictureElement.getElementsByTagName('img')[0].src
            this.mainImage.getElementsByTagName("img")[0].src = imagePictureElement.getElementsByTagName('img')[0].src
            if (image?.title) {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = image.title
            } else {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = ''
            }

            if (image?.description) {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = image.description
            } else {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = ''
            }
        }
    }

    private highLightImageInList(img: HTMLElement, fromArrows: boolean) {
        this.imagesInList.forEach(image => {
            image[0].classList.add("opacity-70")
        })
        img.classList.remove("opacity-70")

        if (!fromArrows) return

        let imgClass = this.imagesInList.find(imageList => {
            return imageList.some(item => item === img)
        })

        if (imgClass) {
            if (imgClass[1].imageTitle) {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = imgClass[1].imageTitle
            } else {
                if (this.mainImgTitle)
                    this.mainImgTitle.innerHTML = ''
            }

            if (imgClass[1].imageDescription) {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = imgClass[1].imageDescription
            } else {
                if (this.mainImgDescription)
                    this.mainImgDescription.innerHTML = ''
            }
        }
    }

    public setImgPerPage() {
        if (window.innerWidth < 820) {
            if (this.imgPerPage != 3) {
                this.imgPerPage = 3
                this.setImgList()
            }
        } else if (window.innerWidth < 1155) {
            if (this.imgPerPage != 4) {
                this.imgPerPage = 4
                this.setImgList()
            }
        } else if (window.innerWidth < 1355) {
            if (this.imgPerPage != 4) {
                this.imgPerPage = 4
                this.setImgList()
            }
        } else {
            if (this.imgPerPage != 5) {
                this.imgPerPage = 5
                this.setImgList()
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
    imageGallery.initArrows()
    imageGallery.initMainImg()
    imageGallery.initImgList()

    window.addEventListener('resize', () => {
        imageGallery.setImgPerPage();
    });
}); 
