startAddon();


function startAddon(): void {
    const urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();

    urlChangeEmitter.emitter.addEventListener('home', () => {
        console.log('home');
    });

    urlChangeEmitter.emitter.addEventListener('post', () => {
        console.log('post');

    });

    urlChangeEmitter.emitter.addEventListener('explore', () => {
        console.log('explore');

    });

    urlChangeEmitter.emitter.addEventListener('story', () => {
        console.log('story');

    });

    urlChangeEmitter.emitter.addEventListener('chanel', () => {
        console.log('chanel');

    });

    urlChangeEmitter.emitter.addEventListener('tv', () => {
        console.log('tv');

    });

    urlChangeEmitter.emitter.addEventListener('saved', () => {
        console.log('saved');

    });

    urlChangeEmitter.emitter.addEventListener('tagged', () => {
        console.log('tagged');

    });

    urlChangeEmitter.emitter.addEventListener('account', () => {
        console.log('account');
    });

    urlChangeEmitter.emitLocationEvent();
}
