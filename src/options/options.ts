import { BulletPoint, changeLog } from './changelog';
import './options.scss';

(document.querySelector('#year') as HTMLElement).innerText = new Date().getFullYear().toString();
displayChangelog();

function displayChangelog(): void {
    let versionHtml = '';
    for (const key of Object.keys(changeLog)) {
        const version = changeLog[key];
        versionHtml += `<h3>Version ${key}</h3>`;

        if (version.New) versionHtml += append(version.New, 'New:');
        if (version.Fixes) versionHtml += append(version.Fixes, 'Fixes');
    }

    (document.querySelector('#changelog') as HTMLDivElement).innerHTML = versionHtml;
}

// @ts-ignore
function append(bulletPoint: (BulletPoint | string)[], type: string): string {
    let returnHtml = `<h4>${type}</h4>`;
    returnHtml += '<ul>';
    bulletPoint.forEach(b => {
        if (typeof b === 'object') {
            returnHtml += `<li><a href="${b.link}" target="_blank">${b.text}</a></li>`;
        } else {
            returnHtml += `<li>${b}</li>`;
        }
    });

    returnHtml += '</ul>';

    return returnHtml;
}
