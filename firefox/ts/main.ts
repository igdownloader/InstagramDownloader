startAddon();


async function startAddon(): Promise<void> {
    const urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();

    urlChangeEmitter.addEventListener('home', () => {
        console.log('home');
    });

    urlChangeEmitter.addEventListener('post', () => {
        console.log('post');

    });

    urlChangeEmitter.addEventListener('explore', () => {
        console.log('explore');

    });

    urlChangeEmitter.addEventListener('story', () => {
        console.log('story');

    });

    urlChangeEmitter.addEventListener('chanel', () => {
        console.log('chanel');

    });

    urlChangeEmitter.addEventListener('tv', () => {
        console.log('tv');

    });

    urlChangeEmitter.addEventListener('saved', () => {
        console.log('saved');

    });

    urlChangeEmitter.addEventListener('tagged', () => {
        console.log('tagged');

    });

    urlChangeEmitter.addEventListener('account', () => {
        console.log('account');

    });

    await urlChangeEmitter.startURLLister();
}
