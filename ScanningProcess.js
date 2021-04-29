function ScanningProcess(actions) {
    this.actions = actions;
    this.stage = 0;
    this.runner = null;
}
ScanningProcess.prototype.run = function () {
    if (this.stage >= this.actions.length) return false;
    let action = this.actions[this.stage];
    this.runner = setInterval(() => {
        if (action.func()) {
            clearInterval(this.runner);
            this.stage += 1;
            this.run();
        }
    }, action.duration);
    return true;
};