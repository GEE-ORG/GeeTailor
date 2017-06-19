export function assign (defaultOption: object, option: object) {
    const retOption = Object.create(defaultOption);
    function _assign (retOption, option) {
        Object.keys(option).forEach(key => {
            if (!(key in retOption)) {
                return;
            }
            const type = Object.prototype.toString.call(retOption[key]);
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