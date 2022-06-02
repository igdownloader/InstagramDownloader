/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (Alert.ts) is part of InstagramDownloader which is not released            *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/
import '../../scss/alert.scss';

export type AlertType = 'default' | 'warn' | 'error';

const HTML = `
    <div class="alert">
        <i class="close"></i>
        <div class="alert-message"></div>
    </div>
    `;

const WRAPPER = (() => {
    const alertWrapper = document.createElement('div');
    alertWrapper.classList.add('alert-wrapper');
    document.body.appendChild(alertWrapper);

    return alertWrapper;
})();

// tslint:disable-next-line:no-namespace
export namespace Alert {

    export const create = (text: string, type: AlertType, dismissible: boolean): HTMLElement => {
        const div = document.createElement('div');
        div.innerHTML = HTML;
        const alert = div.children[0] as HTMLElement;

        const close = (alert.querySelector('.close') as HTMLElement);
        if (dismissible) {
            close.onclick = () => remove(alert);
        } else {
            close.remove();
        }
        alert.classList.add(type);
        (alert.querySelector('.alert-message') as HTMLElement).innerText = text;

        return alert;
    };

    export const createAndAdd = async (text: string, type: AlertType = 'default', dismissible: boolean = true, timeout: number | null = 5000): Promise<HTMLElement> => {
        const alert = create(text, type, dismissible);
        await add(alert, timeout);

        return alert;
    };

    export const add = async (alert: HTMLElement, timeout: number | null): Promise<void> => {
        WRAPPER.appendChild(alert);
        await animateIn(alert);

        timeout && setTimeout(() => remove(alert), timeout);
    };

    export const remove = async (element: HTMLElement): Promise<void> => {
        const animation = element.animate(
            [{opacity: '1'}, {opacity: '0'}],
            {duration: 300, fill: 'forwards'},
        );
        await animation.finished;
        element.remove();
    };

    const animateIn = async (element: HTMLElement): Promise<void> => {
        const animation = element.animate(
            [{opacity: '0'}, {opacity: '1'}],
            {duration: 300, fill: 'forwards'},
        );
        await animation.finished;
    };
}
