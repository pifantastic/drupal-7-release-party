
// Based on http://www.openprocessing.org/visuals/?visualID=6910

var Boid = function() {

	var vector = new THREE.Vector3(),
	    _acceleration, 
	    _width = window.innerWidth, 
	    _height = window.innerHeight, 
	    _depth = 150, 
	    _goal, 
	    _neighborhoodRadius = 30,
	    _maxSpeed = 5, 
	    _maxSteerForce = 0.6, 
	    _avoidWalls = true;

	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	_acceleration = new THREE.Vector3();

	this.setGoal = function ( target ) {
		_goal = target;
	}

	this.setAvoidWalls = function ( value ) {
		_avoidWalls = value;
	}

	this.setWorldSize = function ( width, height, depth ) {
		_width = width;
		_height = height;vector
		_depth = depth;
	}

	this.run = function ( boids ) {
		if ( _avoidWalls ) {
			vector.set( - _width, this.position.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.addSelf( vector );
			
			vector.set( _width, this.position.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.addSelf( vector );

			vector.set( this.position.x, - _height, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.addSelf( vector );

			vector.set( this.position.x, _height, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.addSelf( vector );

			vector.set( this.position.x, this.position.y, - _depth );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.addSelf( vector );

			vector.set( this.position.x, this.position.y, _depth );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.addSelf( vector );
		}/* else {

			this.checkBounds();

		}
		*/

		if ( Math.random() > 0.5 ) {
			this.flock( boids );
		}

		this.move();
	}

	this.flock = function ( boids ) {
		if ( _goal ) {
			_acceleration.addSelf( this.reach( _goal, 0.005 ) );
		}

		_acceleration.addSelf( this.alignment( boids ) );
		_acceleration.addSelf( this.cohesion( boids ) );
		_acceleration.addSelf( this.separation( boids ) );
	}

	this.move = function () {
		this.velocity.addSelf( _acceleration );
		var l = this.velocity.length();
		if ( l > _maxSpeed ) {
			this.velocity.divideScalar( l / _maxSpeed );
		}

		this.position.addSelf( this.velocity );
		_acceleration.set( 0, 0, 0 );
	}

	this.checkBounds = function () {
		if ( this.position.x >   _width ) this.position.x = - _width;
		if ( this.position.x < - _width ) this.position.x =   _width;
		if ( this.position.y >   _height ) this.position.y = - _height;
		if ( this.position.y < - _height ) this.position.y =  _height;
		if ( this.position.z >  _depth ) this.position.z = - _depth;
		if ( this.position.z < - _depth ) this.position.z =  _depth;
	}

	//

	this.avoid = function ( target ) {
		var steer = new THREE.Vector3();
		steer.copy( this.position );
		steer.subSelf( target );
		steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
		return steer;
	}

	this.repulse = function ( target ) {
		var distance = this.position.distanceTo( target );
		if ( distance < 150 ) {
			var steer = new THREE.Vector3();
			steer.sub( this.position, target );
			steer.multiplyScalar( 0.5 / distance );
			_acceleration.addSelf( steer );
		}
	}

	this.reach = function ( target, amount ) {
		var steer = new THREE.Vector3();
		steer.sub( target, this.position );
		steer.multiplyScalar( amount );
		return steer;
	}

	this.alignment = function ( boids ) {
		var boid, velSum = new THREE.Vector3(),
		count = 0;
		for ( var i = 0, il = boids.length; i < il; i++ ) {
			if ( Math.random() > 0.6 ) continue;
			boid = boids[ i ];
			distance = boid.position.distanceTo( this.position );
			if ( distance > 0 && distance <= _neighborhoodRadius ) {
				velSum.addSelf( boid.velocity );
				count++;
			}
		}

		if ( count > 0 ) {
			velSum.divideScalar( count );
			var l = velSum.length();
			if ( l > _maxSteerForce ) {
				velSum.divideScalar( l / _maxSteerForce );
			}
		}

		return velSum;
	}

	this.cohesion = function ( boids ) {
		var boid, distance,
		posSum = new THREE.Vector3(),
		steer = new THREE.Vector3(),
		count = 0;

		for ( var i = 0, il = boids.length; i < il; i ++ ) {
			if ( Math.random() > 0.6 ) continue;
			boid = boids[ i ];
			distance = boid.position.distanceTo( this.position );
			if ( distance > 0 && distance <= _neighborhoodRadius ) {
				posSum.addSelf( boid.position );
				count++;
			}
		}

		if ( count > 0 ) {
			posSum.divideScalar( count );
		}

		steer.sub( posSum, this.position );
		var l = steer.length();
		if ( l > _maxSteerForce ) {
			steer.divideScalar( l / _maxSteerForce );
		}

		return steer;
	}

	this.separation = function ( boids ) {
		var boid, distance,
		posSum = new THREE.Vector3(),
		repulse = new THREE.Vector3();

		for ( var i = 0, il = boids.length; i < il; i ++ ) {
			if ( Math.random() > 0.6 ) continue;
			boid = boids[ i ];
			distance = boid.position.distanceTo( this.position );
			if ( distance > 0 && distance <= _neighborhoodRadius ) {
				repulse.sub( this.position, boid.position );
				repulse.normalize();
				repulse.divideScalar( distance );
				posSum.addSelf( repulse );
			}
		}

		return posSum;
	}
}

var SCREEN_WIDTH = document.documentElement.offsetWidth,
SCREEN_HEIGHT = document.documentElement.offsetHeight,
SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

var camera, scene, renderer,
birds, bird;

var boid, boids;

var stats;

$.fn.bats = function(before, delay, after) {
  this.each(function() {
    var $this = $(this),
        offset = $this.offset();
        
    $this.click(function() {
      before();
      var interval = bats();
      
      setTimeout(function() {
        clearInterval(interval);
        if (renderer) renderer.clear();
        after();
      }, delay);
      
      return false;
    });
  });
};

function bats() {
  // Don't ever do this...
  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (!is_chrome && !is_ff) {
    return;
  }
  
  SCREEN_WIDTH = $(document).width();
  SCREEN_HEIGHT = $(document).height();
  SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2;
  SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
  
  var num = is_chrome ? 150 : 20;
  
	camera = new THREE.Camera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 450;

	scene = new THREE.Scene();

	birds = [];
	boids = [];
  
	for ( var i = 0; i < num; i ++ ) {
		boid = boids[ i ] = new Boid();
		boid.position.x = 120;
		boid.position.y = -400;
		boid.position.z = 0;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls( true );
		boid.setWorldSize( 500, 500, 400 );

		bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshColorFillMaterial( Math.random() * 0xffffff ) );
		bird.phase = Math.floor( Math.random() * 62.83 );
		bird.position = boids[ i ].position;
		bird.doubleSided = true;
		scene.addObject( bird );
	}
  
  if (renderer) renderer.clear();
	renderer = new THREE.CanvasRenderer();
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	$("canvas.bats").remove();
	$(renderer.domElement).addClass("bats");
	$("body").prepend( renderer.domElement );

	return setInterval( loop, 1000 / 200 );
}

function onDocumentMouseMove( event ) {
	var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );
	for ( var i = 0, il = boids.length; i < il; i++ ) {
		boid = boids[ i ];
		vector.z = boid.position.z;
		boid.repulse( vector );
	}
}

function loop() {
	for ( var i = 0, il = birds.length; i < il; i++ ) {
		boid = boids[ i ];
		boid.run( boids );

		bird = birds[ i ];

		color = bird.material[0].color;
		color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;
		color.updateStyleString();

		bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

		bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		bird.geometry.vertices[ 10 ].position.y = bird.geometry.vertices[ 11 ].position.y = bird.geometry.vertices[ 8 ].position.y = bird.geometry.vertices[ 9 ].position.y = Math.sin( bird.phase ) * 5;
	}

	renderer.render( scene, camera );
}
