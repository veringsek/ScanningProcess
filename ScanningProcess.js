function ScanningProcess(actions, defaults = {}) {
    this.actions = actions;
    this.stage = 0;
    this.runner = null;
    this.defaults = defaults;
}
ScanningProcess.prototype.run = function () {
    if (this.stage >= this.actions.length) return false;
    let action = this.actions[this.stage];
    let duration = action.duration ?? this.defaults.duration;
    let onerrors = action.onerrors ?? this.defaults.onerrors;
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
        if (done) {
            clearInterval(this.runner);
            this.stage += 1;
            this.run();
        }
    }, duration);
    return true;
};