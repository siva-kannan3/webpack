import { NotHere as aaa, /* not here */ a } from "./aaa/index.js";
import { NotHere as bbb, /* not here */ b } from "./bbb/index.js";
import { NotHere as ccc, /* not here */ c } from "./ccc/index.js";
import { NotHere as ddd, /* not here */ d } from "./ddd/index.js";
import * as m from "./module";

const val1 = Math.random();

function throw_() {
	throw new Error();
}
function justFunction() {}

describe("should not add additional warnings/errors", () => {
	it("simple cases", () => {
		if (b) {
			if (d) d();
			b();
			if (c) {
				b();
			}
		}
		(false && d);
		(d ? d() : throw_());
		// should add 2 warnings
		if (a && val1 || true) {
			a();
		}
		if (a && a.b && a.b.c) {
			a();
		}
		// only one warning
		if (a.b.c) {
			a.b.c();
		}
	});

	it("different expressions", () => {
		if (a && a.b.c) {}
		// should add warning (function scope)
		if ((() => a())()) {}
		// should add warning (unary expression)
		if (!a && b) {}
		// should add warning (binary expression)
		if (a & true) {}

		function *foo() {
			// should add warning (yield expression)
			if (yield a && true) {}
		}
		async function foo1() {
			// should add warning (yield expression)
			if (await a && true) {}
		}
		let var1;
		if (var1 = b) {}
		if ((var1 = b) && c && c.a) {}
		// should add warning
		if (justFunction`${a}`) {}
		if (`${a}`) {}
	});

	it("in operator", () => {
		if ("a" in m) { justFunction(m.a); }
		if ("b" in m && "c" in m.b) { justFunction(m.b.c); }
		if ("c" in m) { justFunction(m.c); }
	});
});

it("should not add additional warnings/errors", () => {
});

it("should do nothing", () => {
	expect(aaa).toBe(undefined);
	expect(bbb).toBe(undefined);
	expect(ccc).toBe(undefined);
	expect(ddd).toBe(undefined);
});
