# ScanningProcess
`ScanningProcess` is used to simulate scanning procedure, in which codes are runned with a period, in a JavaScript environment. 

When a `ScanningProcess` starts, it runs the first `action`, which is stored in its `ScanningProcess.actions`, by calling `action.func()` again and again, with a waiting period of `action.duration`, until the `action` is determined done when `action.func()` returns `true`. 

After an `action` is done, `ScanningProcess` will start the next `action`, until the `ScanningProcess.actions` are all done.

## Usage

Return `true` when you think an `action` is done, and `false` if you think an `action` is not done yet. 

`duration` is in milliseconds.

```js
let sp = new ScanningProcess([{
    func: function () {
        someButton.click();
        return true;
    }, 
    duration: 100
}, {
    func: function () {
        if (resultIsRendered()) {
            getRenderedResult();
            return true;
        }
        return false;
    }, 
    duration: 500
}]])
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright © ROC 110 (2021), veringsek