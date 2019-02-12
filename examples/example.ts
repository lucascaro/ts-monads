import { none, Option, some } from '../src/monads/Option';
import { err, ok, Result, ResultKind } from '../src/monads/Result';
/** @tslint  */
function attemptSomething(param: boolean): Result<string, string> {
  return param
    ? ok('the parameter is true')
    : err('the parameter should be true');
}

function handle(param: boolean): Result<string, string> {
  console.log(`handling ${param}`);
  return attemptSomething(param)
    .map((r) => (console.log(`Success: ${r}`), r))
    .mapErr((e) => (console.log(`error: ${e}`), e));
}

console.log(handle(true).unwrap());
console.log(handle(false).unwrapErr());

function assertNever(x: never): never {
  throw new Error(`unknown value: ${x}`);
}

function exhaustiveCases(result: Result<any, any>) {
  switch (result.kind) {
    case ResultKind.ok:
      return console.log('is ok');
    case ResultKind.err:
      return console.log('is err');
    default:
      return assertNever(result);
  }
}

exhaustiveCases(handle(true));
exhaustiveCases(handle(false));

// Option

function maybeGetThing1(): Option<string> {
  return some('thing1');
}
function maybeGetThing2(): Option<string> {
  return none();
}

console.log(maybeGetThing1().unwrapOr('default'));
console.log(maybeGetThing2().unwrapOr('default'));

console.log(
  maybeGetThing1()
    .map((t) => `Got a thing: ${t}`)
    .unwrap(),
);

for (const t of maybeGetThing1()) {
  console.log(`ITER: ${t}`);
}

for (const t of maybeGetThing2()) {
  throw new Error('Should not get in here');
}
