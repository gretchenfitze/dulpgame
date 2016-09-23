/* eslint-disable */
// var chai = require('chai');
// var assert = chai.assert,
// expect = chai.expect,
// should = chai.should();

// var Game = require('../public/build/app.min.js');
// var app = '../src/js/app.js';

describe('Game', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal(-1, [1,2,3].indexOf(4));
		});
	});
	describe('constructor', function() {
		it('game instance creating', function() {
			var game = new Game();
			should.exist('game');
		});

	// 	it("should set cow's name if provided", function() {
	// 		var cow = new Cow("Kate");
	// 		expect(cow.name).to.equal("Kate");
	// 	});
	// });

	describe("#greets", function() {
		it("should throw if no target is passed in", function() {
			expect(function() {
				(new Cow()).greets();
			}).to.throw(Error);
		});

		// it("should greet passed target", function() {
		// 	var greetings = (new Cow("Kate")).greets("Baby");
		// 	expect(greetings).to.equal("Kate greets Baby");
		});
	});
});
