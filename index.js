/* Simple XML module */
module.exports = Node;

/* Creates a new XML node */
function Node( type ) {
	this.type = type;
	this.namespace = undefined;
	this.attributes = {};
	this.namespaces = {};
	this.content = undefined;
	this.children = [];
}

/* Sets the Node's content */
Node.prototype.setContent = function( content ) {
	if( this.children.length > 0 ) {
		throw new Error( 'Node has children, can\'t add content' );
	}
	
	this.content = content;
};

/* Adds the specified node as a child */
Node.prototype.addChild = function( child, position ) {
	if( this.content ) {
		throw new Error( 'Node has content, can\'t add children' );
	}
	
	if( position !== undefined && position < this.children.length ) { // position specified
		this.children.splice( position, 0, child );
		console.log(this.children)
	}
	else { // no position specifed
		this.children.push( child );
	}
		
};

/* Gets and sets node attributes */
Node.prototype.attr = function( name, value ) {
	if ( value !== undefined ) { // set value
		this.attributes[ name ] = value;
	}
	else { // get value
		if ( name in this.attributes ) { // attribute found
			return this.attributes[ name ];
		}
		else { // atribute not found
			return undefined;
		}
	}
};

/* Adds Namespace Declarations to Node */
/* If name is default, that will be the default namespace */
Node.prototype.addNamespace = function( name, source ) {
	this.namespaces[ name ] = source;
};

/* Converts the Node to a string */
Node.prototype.toString = function() {
	var out = '<',
		typeOut,
		i;
	
	if ( this.namespace ) {
		typeOut = this.namespace + ':' + this.type;
	}
	else {
		typeOut = this.type;
	}
	out += typeOut;
	
	// Attributes
	for( i in this.attributes ) {
		out += ' ' + i + '="' + this.attributes[i] + '"';
	}
	
	// Namespaces
	for( i in this.namespaces ) {
		if( i === 'default' ) {
			out += ' xmlns' + '="' + this.namespaces[i] + '"';
		}
		else {
			out += ' xmlns:' + i + '="' + this.namespaces[i] + '"';
		}
	}
	
	// No Content or children
	if ( this.children.length === 0 && this.content === undefined ) { 
		 out += ' />';
		 
		 return out;
	}
	else {
		out += '>';
	}
	
	// Has Content or Children
	// Note: A Node should never have both content and children, 
	// however if one does children take precedent and the content is ignored.
	if( this.children.length > 0 ) { // Has children
		this.children.forEach( function( child ) {
			out += child.toString();
		} );
	}
	else if( this.content !== undefined ) { // has content
		out += this.content;
	}
	
	// Clsoing tag
	out += '</' + typeOut + '>';
	
	return out ;
};