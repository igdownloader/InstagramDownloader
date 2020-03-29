/**
 * A modal which can be added to a html page
 */
class Modal {

    private _header: string;
    private _textList: string[];
    private _buttonList: ModalButton[];
    private _imageURL: string;

    private addedToDome: boolean = false;
    private visible: boolean = false;
    private modalElement: HTMLElement;

    /**
     *
     * @param header The header of the modal
     * @param textList The text which can be in the modal. Every list item is in a new row
     * @param buttonList The buttons which are in the modal
     * @param imageURL The url of the header image
     */
    constructor(header: string, textList: string[], buttonList: ModalButton[], imageURL: string) {
        this._header = header;
        this._textList = textList;
        this._buttonList = buttonList;
        this._imageURL = imageURL;
        this.createModal();
    }


    /**
     * Create a new modal
     */
    private createModal(): void {
        this.modalElement = document.createElement('div');
        this.modalElement.classList.add('modal-overlay');

        const modal = document.createElement('div');
        modal.classList.add('modal');
        this.modalElement.appendChild(modal);

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modal.appendChild(modalBody);

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalBody.appendChild(modalContent);

        const imageWrapper = document.createElement('div');
        modalContent.appendChild(imageWrapper);

        const image = document.createElement('img');
        image.setAttribute('height', '76px');
        image.setAttribute('width', '76px');
        image.style.margin = 'auto';
        image.setAttribute('src', this._imageURL);
        imageWrapper.appendChild(image);

        const modalHeader = document.createElement('h2');
        modalHeader.classList.add('modal-header');
        modalHeader.innerText = this._header;
        modalContent.appendChild(modalHeader);

        this._textList.forEach(text => {
            const modalText = document.createElement('p');
            modalText.classList.add('modal-text');
            modalText.innerText = text;
            modalContent.appendChild(modalText);
        });

        this._buttonList.forEach((button: ModalButton) => {
            const modalButton = document.createElement('button');
            modalButton.classList.add('modal-button');
            modalButton.innerText = button.text;

            if (button.active) {
                modalButton.classList.add('modal-active-button');
            }

            if (button?.callback !== undefined) {
                modalButton.onclick = button.callback;
            }

            modalBody.appendChild(modalButton);
        });
    }

    private updateModal(): void {
        this.createModal();
        if (this.addedToDome) {
            this.addToPage();
        }

        if (this.visible) {
            this.showModal();
        }
    }

    /**
     * Show the modal
     */
    public showModal(): void {
        if (!this.addedToDome) {
            this.addToPage();
        }

        this.visible = true;
        this.modalElement.classList.add('visible');
        setTimeout(() => {
            this.modalElement.classList.add('show');
        }, 1);
    }

    /**
     * Hide the modal
     */
    public hideModal(): void {
        this.visible = false;
        this.modalElement.classList.remove('visible');
        this.modalElement.classList.remove('show');
    }

    /**
     * Add the modal to the page
     */
    public addToPage(): void {
        this.addedToDome = true;
        document.body.appendChild(this.modalElement);
    }

    /**
     * Remove the modal from the page
     */
    public removeFromPage(): void {
        this.addedToDome = false;
        this.hideModal();
        setTimeout(() => {
            try {
                this.modalElement.remove();
            } catch {
            }
        }, 100);
    }

    get header(): string {
        return this._header;
    }

    set header(value: string) {
        this._header = value;
        this.updateModal();
    }

    get textList(): string[] {
        return this._textList;
    }

    set textList(value: string[]) {
        this._textList = value;
        this.updateModal();
    }

    get buttonList(): ModalButton[] {
        return this._buttonList;
    }

    set buttonList(value: ModalButton[]) {
        this._buttonList = value;
        this.updateModal();
    }

    get imageURL(): string {
        return this._imageURL;
    }

    set imageURL(value: string) {
        this._imageURL = value;
        this.updateModal();
    }

}

/**
 * An interface for the modal button
 */
interface ModalButton {
    text: string;
    active: boolean;
    callback?: () => void;
}
