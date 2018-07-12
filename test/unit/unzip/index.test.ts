import test from 'ava'
import handler from "../../../src/lambdas/unzip/index";

test('Should throw on missing Destination Bucket', async (t) => {
    console.log(handler)
    t.pass();
});