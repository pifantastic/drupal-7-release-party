var Bird = function () {

	var scope = this;

	THREE.Geometry.call(this);

/*
	v(   6,   0,   0 );
	v( - 5, - 2,   1 );
	v( - 5,   0,   0 );
	v( - 5, - 2, - 1 );

	v(   0,   2, - 6 );
	v(   0,   2,   6 );
	v(   2,   0,   0 );
	v( - 3,   0,   0 );

	f3( 0, 2, 1 );
	f3( 0, 3, 2 );

	f3( 4, 7, 6 );
	f3( 5, 6, 7 );
*/
  
  v( 2,  0,  0);
  v(-3, -1, -1);
  v(-4,  0,  0);
  v(-3, -1,  1);
  v( 2, -1, -1);
  v( 2, -1,  1);
  v( 2,  0,  0);
  v(-3,  0,  0);
  v( 0,  2,  5);
  v( 0,  2, -5);
  v(-2,  2,  4);
  v(-2,  2, -4);

  f4(0, 5, 3, 2);
  f4(0, 4, 1, 2);
  f4(6, 8, 10, 7);
  f4(6, 9, 11, 7);
  
	function v( x, y, z ) {
		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
	}

	function f3( a, b, c ) {
		scope.faces.push( new THREE.Face3( a, b, c ) );
	}

	function f4( a, b, c, d ) {
		scope.faces.push( new THREE.Face4( a, b, c, d ) );
	}

}

Bird.prototype = new THREE.Geometry();
Bird.prototype.constructor = Bird;
