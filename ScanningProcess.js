/**
 * ScanningProcess
 * @version 1.0.0
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
ScanningProcess.prototype.start = function () {
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
            this.stop();
            this.stage += 1;
            this.start();
        }
    }, duration);
    return true;
};
ScanningProcess.prototype.stop = function () {
    clearInterval(this.runner);
};