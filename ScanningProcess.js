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
    this.runner = setInterval(() => {
        if (action.func()) {
            clearInterval(this.runner);
            this.stage += 1;
            this.run();
        }
    }, duration);
    return true;
};