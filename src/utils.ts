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

export function toBlob (data, type): Blob {
    return new Blob([data], {type});
}

export function toUrl (obj): string {
    return URL.createObjectURL(obj);
}

interface coordinate {
    x: number, 
    y: number
}
export function pointInArea(
    point: coordinate, 
    area: {
        start: coordinate, 
        end: coordinate
    }
): boolean {
    const startPoint = JSON.parse(JSON.stringify(area.start));
    const endPoint = JSON.parse(JSON.stringify(area.end));
    startPoint.x > endPoint.x && ([startPoint.x, endPoint.x] = [endPoint.x, startPoint.x]);
    startPoint.y > endPoint.y && ([startPoint.y, endPoint.y] = [endPoint.y, startPoint.y]);
    if (
        point.x >= startPoint.x &&
        point.x <= endPoint.x &&
        point.y >= startPoint.y &&
        point.y <= endPoint.y
    ) {
        return true;
    }
    return false;
}


export function setCursor (cursor?: string) {
    document.body.style.cursor = cursor || 'auto';
}