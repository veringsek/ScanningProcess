/**
 * ScanningProcess
 * @version 2.1.0
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
    this.stage = 0;
    this.runner = null;
    this.defaults = defaults;
}
ScanningProcess.prototype.start = function () {
    let stage = this.stage;
    if (typeof this.stage === 'number') {
        stage = this.schedule[stage];
    }
    if (!(stage in this.actions)) return false;
    let action = this.actions[stage];
    let duration = action.duration ?? this.defaults.duration ?? 100;
    let onerrors = action.onerrors ?? this.defaults.onerrors;
    let und = action.und ?? this.defaults.und;
    let following = action.following;
    this.runner = setInterval(() => {
        let next;
        try {
            next = action.func();
        } catch (error) {
            if (onerrors) {
                next = onerrors(this, action, error);
            } else {
                throw error;
            }
        }
        if (typeof next === 'undefined') {
            next = und;
        }
        if (next || next === 0) {
            this.stop();
            if (next === true) {
                if (typeof this.stage === 'number') {
                    this.stage += 1;
                } else if (typeof this.stage === 'string') {
                    this.stage = following;
                }
            } else {
                this.stage = next;
            }
            this.start();
        }
    }, duration);
    return true;
};
ScanningProcess.prototype.stop = function () {
    clearInterval(this.runner);
};