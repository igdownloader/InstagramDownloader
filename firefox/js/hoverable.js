class Hoverable {
    constructor(divClass) {
        this.divClass = divClass;
        this.hoverables = null;
        this.link;
    }

    createHoverable() {
        let divImages = document.getElementsByClassName(this.divClass);

        let root = null;
        let divOverlay = null;
        let buttonHover = null;
        this.hoverables = [];

        for (let i = 0; i < divImages.length - 1; ++i) {
            root = divImages[i];

            divOverlay = document.createElement("div");
            divOverlay.classList.add("middle");
            root.appendChild(divOverlay);

            buttonHover = document.createElement("div");
            buttonHover.classList.add("button");
            divOverlay.appendChild(buttonHover);

            root.firstElementChild.href;


            this.hoverables.push(divOverlay);
        }
    }

    removeHoverable() {
        try {
            if (this.hoverables.length > 0) {
                for (let i = 0; i < this.hoverables.length - 1; ++i) {
                    i.remove();
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}