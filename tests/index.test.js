var should 	= require( 'should' ),
	assert 	= require( 'assert' ),
	xmlNode = require( '../index' );

describe( 'Node', function() {
	it( 'should create a new node with the given type', function() {
		node = new xmlNode( 'div' );

		node.type.should.equal( 'div' );
	} );
} );

describe( 'Node methods', function() {
	beforeEach( 'Create a node', function( done ) {
		node = new xmlNode();

		done();
	} );


	describe( '#setContent', function() {

		describe( 'if node has no children', function() {
			it( 'should set the content of the node', function() {
				node.setContent( 'test' );

				node.content.should.equal( 'test' );
			} );
		} );

		describe( 'if node has children', function() {
			it( 'should throw an Error', function() {
				child = new xmlNode( 'child' );
				node.children.push( child );

				assert.throws( function() { node.setContent( 'test' ); } );
			} );
		} );
	} ); // end #setContent

	describe( '#addChild', function() {
		beforeEach( function() {
			child = new xmlNode( 'child' );
			youngest = new xmlNode( 'youngest' );
		} );

		describe( 'if node has content', function() {
			it( 'should throw an error', function() {
				node.content = 'test';

				assert.throws( function() { node.addChild( child ); } );
			} );
		} );

		describe( 'if position is not specified', function() {
			it( 'should add the child to the end of the node', function() {
				// add first child
				node.addChild( child );
				node.children.length.should.equal( 1 );

				// add second child
				node.addChild( youngest );
				node.children.length.should.equal( 2 );
				node.children[ node.children.length - 1 ].should.equal( youngest );
			} ) 
		} );

		describe( 'if position is specified', function() {
			describe( 'if position is within child range', function() {
				it( 'should add the child to the specified position', function() {
					// add first child
					node.addChild( child );
					node.children.length.should.equal( 1 );

					// add second child to beginning
					node.addChild( youngest, 0 );
					node.children.length.should.equal( 2 );
					node.children[ 0 ].should.equal( youngest );
				} );
			} );

			describe( 'if position is not within child range', function() {
				it( 'should add the child to the end of the list', function() {
					// add first child
					node.addChild( child );
					node.children.length.should.equal( 1 );

					// add second child
					node.addChild( youngest, 5 );
					node.children.length.should.equal( 2 );
					node.children[ node.children.length - 1 ].should.equal( youngest );
				} );
			} );
		} );
	} ); // end #addChild

	describe( '#attr', function() {
		describe( 'setting an attribute', function() {
			it( 'should set the "test" attirbute to "val"', function() {
				node.attr( 'test', 'val' );

				node.attributes[ 'test' ].should.equal( 'val' );
			} );
		} );

		describe( 'getting an attribute', function() {
			describe( 'if the attribute already exists', function() {
				it( 'should return the attribute', function() {
					node.attributes[ 'test' ] = 'val';

					node.attr( 'test' ).should.equal( 'val' );
				} );
			} );

			describe( 'if the attribute doesn\'t exist', function() {
				it( 'should return undefined', function() {
					should.not.exist( node.attr( 'noexist' ) );
				} );
			} );
		} );
	} ); // end #attr

	describe( '#addNamespace', function() {
		it( 'should add the namespace to the node', function() {
			node.addNamespace( 'default', 'test' );

			node.namespaces[ 'default' ].should.equal( 'test' );
		} );

		describe( 'if the namespace ahs already been added', function() {
			it( 'should replace the value', function() {
				node.addNamespace( 'default', 'test' );
				node.namespaces[ 'default' ].should.equal( 'test' );

				node.addNamespace( 'default', 'newval' );
				node.namespaces[ 'default' ].should.equal( 'newval' );
			} );
		} );
	} ); // end #addNamespace

	describe( '#toString', function() {
		describe( 'if the node doesn\'t have children', function() {
			it( 'should output the string correctly', function() {
				node.type = 'node';
				node.namespaces[ 'default' ] = 'defaultns';
				node.namespaces[ 'newns' ] = 'newns';
				node.content = 'content';

				var out = '<node xmlns="defaultns" xmlns:newns="newns">content</node>';
				node.toString().should.equal( out );
			} );
		} );

		describe( 'if the node has children', function() {
			it( 'should output the string correctly', function() {
				node.type = 'node';
				node.namespaces[ 'default' ] = 'defaultns';
				node.namespaces[ 'newns' ] = 'newns';

				var child1 = new xmlNode( 'child' );
				child1.content = 'child1';

				var child2 = new xmlNode( 'child' );
				child2.content = 'child2';

				node.children.push( child1 );
				node.children.push( child2 );

				var out = '<node xmlns="defaultns" xmlns:newns="newns">' +
					'<child>child1</child>' +
					'<child>child2</child>' +
					'</node>';
				node.toString().should.equal( out );
			} );
		} );

		describe( 'if the node has a default namespace', function() {
			it( 'should output a node with the namespaces', function() {
				node.type = 'node';
				node.namespaces[ 'default' ] = 'defaultns';

				node.toString().should.match( /xmlns="defaultns"/ );
			} );
		} );

		describe( 'if the node has no namespaces', function() {
			it( 'should output a basic node', function() {
				node.type = 'node';
				node.content = 'content';

				var out = '<node>content</node>';
				node.toString().should.equal( out );
			} );
		} );

		describe( 'if the node has a tag namespace', function() {
			it( 'should output the namespace before the tag', function() {
				node.namespace = 'ns';
				node.type = 'node';

				node.toString().should.match( /^<ns:node/ );
			} );
		} );

		describe( 'if the node has attributes', function() {
			it( 'should write the attributes in the tag', function() {
				node.attributes[ 'attr1' ] = 'val1';
				node.attributes[ 'attr2' ] = 'val2';

				node.toString().should.match( /<.*attr1="val1".*>/ );
				node.toString().should.match( /<.*attr2="val2".*>/ );
			} );
		} );
	} ); // end #toString

} ); // end Node methods