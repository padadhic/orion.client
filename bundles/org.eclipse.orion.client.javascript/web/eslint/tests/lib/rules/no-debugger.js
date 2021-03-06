/*******************************************************************************
 * @license
 * Copyright (c) 2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License v1.0
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html).
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global describe it module require*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("assert"),
	eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-debugger";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
describe(RULE_ID, function() {
	it("should flag debugger use in if", function() {
		var topic = "if (a == b) {debugger;}";

		var config = { rules: {} };
		config.rules[RULE_ID] = 1;

		var messages = eslint.verify(topic, config);
		assert.equal(messages.length, 1);
		assert.equal(messages[0].ruleId, RULE_ID);
		assert.equal(messages[0].message, "\'debugger\' statement use is discouraged.");
		assert.equal(messages[0].node.type, "DebuggerStatement");
	});
	it("should flag debugger use in function decl", function() {
		var topic = "function f() {debugger;}";

		var config = { rules: {} };
		config.rules[RULE_ID] = 1;

		var messages = eslint.verify(topic, config);
		assert.equal(messages.length, 1);
		assert.equal(messages[0].ruleId, RULE_ID);
		assert.equal(messages[0].message, "\'debugger\' statement use is discouraged.");
		assert.equal(messages[0].node.type, "DebuggerStatement");
	});
	it("should flag debugger use in function expr", function() {
		var topic = "var f = function() {debugger;}";

		var config = { rules: {} };
		config.rules[RULE_ID] = 1;

		var messages = eslint.verify(topic, config);
		assert.equal(messages.length, 1);
		assert.equal(messages[0].ruleId, RULE_ID);
		assert.equal(messages[0].message, "\'debugger\' statement use is discouraged.");
		assert.equal(messages[0].node.type, "DebuggerStatement");
	});
	it("should flag debugger use in global", function() {
		var topic = "debugger;";

		var config = { rules: {} };
		config.rules[RULE_ID] = 1;

		var messages = eslint.verify(topic, config);
		assert.equal(messages.length, 1);
		assert.equal(messages[0].ruleId, RULE_ID);
		assert.equal(messages[0].message, "\'debugger\' statement use is discouraged.");
		assert.equal(messages[0].node.type, "DebuggerStatement");
	});
	it("should flag debugger use in case", function() {
		var topic = "var v = 0; switch(v) {case 0: debugger; break;};";

		var config = { rules: {} };
		config.rules[RULE_ID] = 1;

		var messages = eslint.verify(topic, config);
		assert.equal(messages.length, 1);
		assert.equal(messages[0].ruleId, RULE_ID);
		assert.equal(messages[0].message, "\'debugger\' statement use is discouraged.");
		assert.equal(messages[0].node.type, "DebuggerStatement");
	});
	it("should flag debugger use in object", function() {
		var topic = "var v = {v: function() {debugger;}}";

		var config = { rules: {} };
		config.rules[RULE_ID] = 1;

		var messages = eslint.verify(topic, config);
		assert.equal(messages.length, 1);
		assert.equal(messages[0].ruleId, RULE_ID);
		assert.equal(messages[0].message, "\'debugger\' statement use is discouraged.");
		assert.equal(messages[0].node.type, "DebuggerStatement");
	});
});
