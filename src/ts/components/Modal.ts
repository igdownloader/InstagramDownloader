/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (Modal.ts) is part of InstagramDownloader which is not released            *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import '../../scss/modal.scss';
import { sleep } from '../functions';

export interface ModalOptions {
    heading?: string;
    buttonList?: ModalButton[];
    imageURL?: string,
    content?: (HTMLElement | string)[];
}

export class Modal {
    public imageURL: string;
    public heading: string;
    public content: (HTMLElement | string)[];
    public buttonList: ModalButton[];

    private modal: HTMLDivElement | null = null;

    public constructor(modalOptions?: ModalOptions) {
        this.imageURL = modalOptions?.imageURL || '';
        this.heading = modalOptions?.heading || '';
        this.content = modalOptions?.content || [''];
        this.buttonList = modalOptions?.buttonList || [];
    }

    public get element(): HTMLDivElement | null {
        return this.modal;
    }

    public async open(): Promise<void> {
        if (this.modal) await this.close();

        this.modal = this.createModal();
        document.body.appendChild(this.modal);
        this.modal.classList.add('visible');
        setTimeout(() => {
            this.modal!.classList.add('show');
        });
    }

    public async close(): Promise<void> {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        await sleep(100);
        this.modal.classList.remove('visible');
        this.modal.remove();
        this.modal = null;
    }

    private createModal(): HTMLDivElement {
        const modalElement = document.createElement('div');
        modalElement.classList.add('modal-overlay');

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modalElement.appendChild(modal);

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
        image.setAttribute('src', this.imageURL);
        imageWrapper.appendChild(image);

        const modalHeader = document.createElement('h2');
        modalHeader.classList.add('modal-header');
        modalHeader.innerText = this.heading;
        modalContent.appendChild(modalHeader);

        this.content.forEach(content => {
            if (typeof content === 'string') {
                const modalText = document.createElement('p');
                modalText.classList.add('modal-text');
                modalText.innerText = content;
                modalContent.appendChild(modalText);
            } else {
                modalContent.appendChild(content);
            }
        });

        this.buttonList.forEach((button: ModalButton) => {
            const modalButton = document.createElement('button');
            modalButton.classList.add('modal-button');
            modalButton.innerText = button.text;

            if (button.active) modalButton.classList.add('active');

            modalButton.onclick = button?.callback ? button.callback : this.close.bind(this);
            modalBody.appendChild(modalButton);
        });

        return modalElement;
    }
}

/**
 * An interface for the modal button
 */
export interface ModalButton {
    text: string;
    active?: boolean;

    callback?(): void;
}
