(function () {
	'use strict';

	QUnit.test( 'Первый тест', function( assert ) {
		assert.ok( 1 == '1', 'Тест пройден!' );
	});

	QUnit.module('Game');
	QUnit.test( 'Game class', function( assert ) {
		let game = new Game();
		assert.ok( game, 'Можно создать инстанс игры' );
		assert.equal( typeof game.someMethod(), 'number',  'someMethod возвращает число' );
	});
})();
