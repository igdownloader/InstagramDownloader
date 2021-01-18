/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (Alert.ts) is part of InstagramDownloader which is released under          *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import '../../scss/alert.scss';
import { sleep } from '../functions';

export type AlertType = 'default' | 'warn' | 'error';

export abstract class Alert {

    private static wrapper: HTMLDivElement = Alert.addBaseToPage();

    public static add(text: string, type: AlertType = 'default', timeout: number = 5000): void {
        const message = document.createElement('div');
        message.classList.add('alert', type);

        const closeIcon = document.createElement('i');
        closeIcon.onclick = () => Alert.remove(message);
        closeIcon.classList.add('close');
        message.appendChild(closeIcon);

        const textElement = document.createElement('div');
        textElement.innerText = text;
        message.appendChild(textElement);

        Alert.wrapper.appendChild(message);
        Alert.animateIn(message);

        sleep(timeout).then(() => Alert.remove(message));
    }

    private static animateIn(element: HTMLDivElement): void {
        element.animate(
            [{opacity: '0'}, {opacity: '1'}],
            {duration: 300, fill: 'forwards'},
        );
    }

    private static addBaseToPage(): HTMLDivElement {
        const wrapper = document.createElement('div');
        wrapper.classList.add('alert-wrapper');
        document.body.appendChild(wrapper);

        return wrapper;
    }

    private static remove(element: HTMLDivElement): void {
        const animation = element.animate(
            [{opacity: '1'}, {opacity: '0'}],
            {duration: 300, fill: 'forwards'},
        );
        animation.finished.then(() => element.remove());
    }
}
