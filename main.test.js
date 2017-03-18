const debugo = require('./index');

const chain = x => ({
  apply: (f) => chain(f(x)),
  value: () => x,
  inspect: () => x,
});

const addOne = x => x + 1;

const f = x => chain(x).apply(addOne)
  .apply(addOne)
  .apply(addOne)
  .value();

function invalid() {
  console.log(1);
  console.log(2);
}

const g = xs => xs.map(addOne)
  .map(addOne)
  .map(addOne)

function tap(x) {
  console.log(x);
  return x;
}

let x = eval(debugo(f));
x(1);

//debugo(g)([1,2]);
//debugo(invalid)();
