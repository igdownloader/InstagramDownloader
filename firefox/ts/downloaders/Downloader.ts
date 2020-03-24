'use strict';

class Downloader {

    init(): void {
        throw new Error('You have to overwrite this function');
    }

    remove(): void {
        throw new Error('You have to overwrite this function');
    }

    /**
     * Get the account name of a post
     * @param element The post element
     */
    protected getAccountName(element: HTMLElement): string {
        let accountName: string;
        try {
            // @ts-ignore
            accountName = element.getElementsByClassName(Variables.accountName)[0].innerText;
        } catch (e) {
            accountName = '';
        }
        return accountName;
    }
}
