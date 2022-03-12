var Promise = require('bluebird');

Promise.config({ cancellation: true });

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('The first promise has resolved');
        resolve(10);
    }, 1 * 1000);
}).then((a) => {
    console.log('then1');
    return a;
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('The second promise has rejected');
        reject('Failed');
    }, 2 * 1000);
}).then((a) => {
    console.log('then2');
    return a;
});

const p3 = new Promise((resolve, reject, onCancel) => {
    var timer = setTimeout(() => {
        console.log('The third promise has resolved');
        resolve(30);
    }, 3 * 1000);
    onCancel((_) => {
        clearTimeout(timer);
        console.log('cancelled 3');
    });
}).then((a) => {
    console.log('then3');
    return a;
});

var promises = [p1, p2, p3];
Promise.all(promises)
    .then(console.log) // never execute
    .catch((err) => {
        console.log(err);
        promises.forEach((p) => p.cancel());
    });
