import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {Interval} from './interval.js';

describe(Interval.name, () => {
	[
		{
			object: undefined,
			expected: false,
		},
		{
			object: {},
			expected: false,
		},
		{
			object: {min: 1},
			expected: false,
		},
		{
			object: {max: 2},
			expected: false,
		},
		{
			object: {min: 'foobar', max: 2},
			expected: false,
		},
		{
			object: {min: 1, max: 'foobar'},
			expected: false,
		},
		{
			object: {min: 0, max: 100},
			expected: true,
		},
	].forEach((testCase) => {
		context(`when ${testCase.object}`, () => {
			it(`should be object: ${testCase.expected}`, () => {
				assert.strictEqual(
					Interval.isObject(testCase.object),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			params: {
				v1: new Interval(0, 100),
				v2: new Interval(0, 100),
			},
			expected: true,
		},
		{
			params: {
				v1: new Interval(0, 100),
				v2: new Interval(-1, 100),
			},
			expected: false,
		},
		{
			params: {
				v1: new Interval(0, 99.9),
				v2: new Interval(0, 100),
			},
			expected: false,
		},
	].forEach((testCase) => {
		context(`when ${testCase.params}`, () => {
			it(`should determine equality: ${testCase.expected}`, () => {
				assert.strictEqual(
					Interval.equals(testCase.params.v1, testCase.params.v2),
					testCase.expected,
				);
			});
		});
	});

	[
		{
			interval: new Interval(0, 100),
			expected: 100,
		},
	].forEach((testCase) => {
		context(`when ${testCase.interval}`, () => {
			it(`should have length: ${testCase.expected}`, () => {
				assert.strictEqual(testCase.interval.length, testCase.expected);
			});
		});
	});

	[
		{
			interval: new Interval(0, 100),
			expected: {min: 0, max: 100},
		},
	].forEach((testCase) => {
		context(`when ${testCase.interval}`, () => {
			it(`should be object: ${testCase.expected}`, () => {
				assert.deepStrictEqual(testCase.interval.toObject(), testCase.expected);
			});
		});
	});
});
