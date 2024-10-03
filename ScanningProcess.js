/**
 * ScanningProcess
 * @version 1.0.0
 * @param {[string]} schedule Names of actions to execute in order.
 * @param {{object|function}} actions Actions to execute when the ScanningProcess `start()`.
 * @param {object} defaults Option values to use as default.
 */
function ScanningProcess(schedule, actions, defaults = {}) {
    this.schedule = schedule;
    this.actions = actions;
    for (let name in this.actions) {
        let action = this.actions[name];
        if (typeof action === 'function') {
            this.actions[name] = {
                func: action
            };
        }
    }
    this.stage = this.schedule[0];
    this.runner = null;
    this.defaults = defaults;
}
ScanningProcess.prototype.start = function () {
    if (!(this.stage in this.actions)) return false;
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