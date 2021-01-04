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

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiCodePosition = 0;
let rotation = 360;

// add keydown event listener
document.addEventListener('keydown', (e) => {
    const requiredKey = konamiCode[konamiCodePosition];
    console.log(e.key);
    if (e.key === requiredKey) {

        // move to the next key in the konami code sequence
        konamiCodePosition += 1;

        // if the last key is reached, activate cheats
        if (konamiCodePosition === konamiCode.length) {
            konamiCodePosition = 0;
            document.body.style.transform = `rotate(${rotation}deg)`;
            rotation += 360;
        }
    } else {
        konamiCodePosition = 0;
    }
});
