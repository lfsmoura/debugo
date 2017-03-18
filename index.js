const babel = require('babel-core');

function tap(x) {
  console.log(x);
  return x;
}

// We want to debug the function
// const g = xs => xs.map(addOne)
//   .map(addOne)
//   .map(addOne)
// We will first transform it into
// tap(tap(tap(tap([1,2,3]).map(addOne)).map(addOne)).map(addOne));
// then run it

function debugo (f, arg, context) {
  const debugoPlugin = function(babel) {
    const tapped = Symbol('tapped');
    const t = babel.types;
    return {
      visitor: {
        MemberExpression(path) {
          if (path.node[tapped]) {
            return;
          }
          const replacement = t.memberExpression(
            t.callExpression(t.identifier('tap'), [path.node.object]),
            path.node.property);
          replacement[tapped] = true;

          path.replaceWith(replacement);
        }
      }
    };
  };

  var out = babel.transform(f, {
    plugins: [debugoPlugin]
  });
  /*
  (function() {
  console.log(context);
  console.log(`let's debug function f = ${f}:`);
  console.log(`here's the generated code: ${out.code}`);
  const d = eval(out.code);
  console.log(`here's the trace for running f with parameter ${arg}:`);
  return d.call(context, arg);
  }).call(context);*/
  return out.code;
}

module.exports = debugo;
