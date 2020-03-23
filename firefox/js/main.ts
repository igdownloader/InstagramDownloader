const a = startAddon();


async function startAddon(): Promise<string> {
    const urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();
    await urlChangeEmitter.startURLLister();

    urlChangeEmitter.addEventListener('home', () => {

    });

    urlChangeEmitter.addEventListener('post', () => {

    });

    urlChangeEmitter.addEventListener('explore', () => {

    });

    urlChangeEmitter.addEventListener('story', () => {

    });

    urlChangeEmitter.addEventListener('chanel', () => {

    });

    urlChangeEmitter.addEventListener('tv', () => {

    });

    urlChangeEmitter.addEventListener('saved', () => {

    });

    urlChangeEmitter.addEventListener('tagged', () => {

    });

    urlChangeEmitter.addEventListener('account', () => {

    });

    return 'alskdf';
}
