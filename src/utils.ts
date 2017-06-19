export function assign (defaultOption: object, option: object): object {
    const retOption = Object.create(defaultOption);
    function _assign (retOption, option) {
        Object.keys(option).forEach(key => {
            if (!(key in retOption)) {
                return;
            }
            const type = toString(retOption[key]);
            if (
                type === '[object Object]' || 
                type === '[object Array]'
            ) {
                retOption[key] = Object.create(retOption[key]);
                _assign(retOption[key], option[key]);
            } else {
                retOption[key] = option[key];
            }
        });
    }
    _assign(retOption, option);
    return retOption;
}

let counter: number = 0;
export function nextTick (cb: Function) {
    if (
        typeof Promise !== 'undefined' &&
        isNative(Promise)
    ) {
        Promise.resolve().then(() => {
            cb();
        }).catch(err => console.error(err));
    } else if (
        typeof MutationObserver !== 'undefined' &&
        (
            isNative(MutationObserver) || 
            // PhantomJS and iOS 7.x
            MutationObserver.toString() === '[object MutationObserverConstructor]'
        )
    ) {
        const observer: MutationObserver = new MutationObserver(cb as MutationCallback);
        var textNode: Text = document.createTextNode(counter + '');
        observer.observe(textNode, {
            characterData: true
        });
        textNode.data = (++counter) + '';
        counter = 0;
    } else {
        setTimeout(cb, 0);
    }
}

export function toString (obj: any): string {
    return Object.prototype.toString.call(obj);
}

export function isNative (func: Function): boolean {
    return /[native code]/.test(func.toString());
}