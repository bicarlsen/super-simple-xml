Super Simple XML
================

Description
-----------
Super Simple XML provides a stripped down version of XML, allowing only the very basic functionality. The point is to make the interface as intuitive and quick to learn as possible.

Methods
-------
### Node(type) 
Creates and returns a new node with the tag specified by type.

### \#setContent(content)
Sets the text content of the Node. Throws an Error if the Node has children.

### \#addChild(child [, position])
Adds the Node "child" to the Node's children list. If position is specified the child will be inserted at that point. Otherwise the child will be appended to the end of the list. Throws an Error if the Node contains content.

### \#atrr(name [, value])
Gets or sets attributes of the Node.
- If only one parameter is specified the value of that attribute is returned.
- If two parameters are provided the attribute of the given name is set to the given value.

### \#addNamespace(name, source)
Adds a namespace to the Node. If name is "default", the default namespace will take the value source.

### \#toString()
Returns the Node as an XML subtree.