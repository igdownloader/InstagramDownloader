class DownloadAll {

    constructor() {
        this.downloadAllButton = "";
        this.modal = "";
    }


    createComponents() {
        this.createButton();
        this.createModal();
    }


    createButton() {
        let root = document.getElementsByClassName("nZSzR")[0];

        this.downloadAllButton = document.createElement("button");
        this.downloadAllButton.classList.add("download-all-button");
        root.appendChild(this.downloadAllButton);
        this.downloadAllButton.innerText = "Download All";


        this.downloadAllButton.addEventListener("click", function () {
            downloadAllButton.modal.style.display = "block";
        });

    }


    createModal() {
        let body = document.body;

        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal.id = "modal";
        body.appendChild(this.modal);

        var modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        modalContent.id = "modal-content";
        this.modal.appendChild(modalContent);

        let closeModal = document.createElement("span");
        closeModal.innerHTML = "&times";
        closeModal.classList.add("close");
        closeModal.onclick = function () {
            downloadAllButton.modal.style.display = "none";
        };
        modalContent.appendChild(closeModal);

        let text = document.createElement("p");
        text.innerHTML = "Do you want to download all pictures of this account? <br> this includes scrolling down until " +
            "all pictures got loaded. <br>" +
            "The scrolling will be handled automatically. Don´t try to interrupt the process, or the download will not succeed";
        text.classList.add("text");
        modalContent.appendChild(text);


        let cancelButton = document.createElement("button");
        cancelButton.style.cssFloat = "left";
        cancelButton.classList.add("modal-button");
        cancelButton.innerText = "Cancel";

        cancelButton.onclick = function () {
            downloadAllButton.modal.style.display = "none";
        };

        let agreeButton = document.createElement("button");
        agreeButton.innerText = "Start";
        agreeButton.classList.add("modal-button");
        agreeButton.style.cssFloat = "right";

        agreeButton.onclick = function () {
            downloadAllButton.modal.style.display = "none";
            sleep(10);
            downloadAllButton.start();
        };

        modalContent.appendChild(agreeButton);

        modalContent.appendChild(cancelButton);
    }

    removeComponents() {
        try {
            this.downloadAllButton.remove();
            this.modal.remove();
        } catch (e) {
            console.log("Could not remove the download All components")
        }
    }

    async start() {
        await this.scrollDown();
        let images = document.getElementsByClassName("v1Nh3 kIKUG  _bz0w");
        let urls = [];

        let part = null;
        for (var i = 0; i < images.length; ++i) {
            part = images[i].firstChild.getAttribute("href");
            urls.push("https://www.instagram.com" + part + "?__a=1");
        }
        this.requests(urls);

    }

    async scrollDown() {
        await sleep(10);
        while (document.getElementsByClassName("By4nA").length > 0) {
            scrollBy(0, 10000);
            await sleep(100);
        }
    }

    requests(urls) {
        
    }

}