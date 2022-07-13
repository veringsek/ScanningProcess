/**
 * ScanningProcess
 * @param {[object|function]} actions Actions to execute when the ScanningProcess `start()`.
 * @param {object} defaults Option values to use as default.
 */
function ScanningProcess(actions, defaults = {}) {
    this.actions = [];
    for (let action of actions) {
        if (typeof action === 'function') {
            this.actions.push({
                func: action
            });
        } else {
            this.actions.push(action);
        }
    }
    this.stage = 0;
    this.runner = null;
    this.defaults = defaults;
}
ScanningProcess.prototype.run = function () {
    if (this.stage >= this.actions.length) return false;
    let action = this.actions[this.stage];
    let duration = action.duration ?? this.defaults.duration ?? 100;
    let onerrors = action.onerrors ?? this.defaults.onerrors;
    let und = action.und ?? this.defaults.und;
    this.runner = setInterval(() => {
        let done;
        try {
            done = action.func();
        } catch (error) {
            if (onerrors) {
                done = onerrors(this, action, error);
            } else {
                throw error;
            }
        }
        if (typeof done === 'undefined') {
            done = und;
        }
        if (done) {
            clearInterval(this.runner);
            this.stage += 1;
            this.run();
        }
    }, duration);
    return true;
};
ScanningProcess.prototype.start = function () {
    this.run();
};
ScanningProcess.prototype.halt = function () {
    clearInterval(this.runner);
};
ScanningProcess.prototype.stop = function () {
    this.halt();
};