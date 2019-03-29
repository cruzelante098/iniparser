'use strict'

const fs = require('fs');
const expect = require('chai').expect;
const parse = require('../lib/iniparser.js').parse;
const ini = fs.readFileSync(`${__dirname}/../reto.ini`, 'utf8');

describe('INI Parser', () => {
	it('should be a function', () => {
		expect(parse).to.be.a('function');
	});

	it('should parse INI content', () => {
		const iniParsed = parse(ini);
		expect(iniParsed).to.be.an('array');
	});

	it('should parse INI content correctly', () => {
		const iniParsed = parse(ini);
		expect(iniParsed).to.be.an('array').with.lengthOf(3);

		expect(iniParsed[0]).to.be.an('array').with.lengthOf(2)
			.that.deep.contains({
				type: "property",
				name: "searchengine",
				value: "https://duckduckgo.com/?q=$1",
			}).and.contains({
				type: "property",
				name: "spitefulness",
				value: "9.7",
			});

		expect(iniParsed[1]).to.have.a.property("type", "section");
		expect(iniParsed[1]).to.have.a.property("value", "gandalf");
		expect(iniParsed[1]).to.have.a.property("properties")
			.that.is.an('array').with.lengthOf(3)
			.that.deep.contains({
				type: "property",
				name: "fullname",
				value: "Mithrandir"
			}).and.contains({
				type: "property",
				name: "type",
				value: "grey wizard"
			}).and.contains({
				type: "property",
				name: "website",
				value: "http://tolkiengateway.net/wiki/Gandalf"
			});

		expect(iniParsed[2]).to.have.a.property("type", "section");
		expect(iniParsed[2]).to.have.a.property("value", "gollum");
		expect(iniParsed[2]).to.have.a.property("properties")
			.that.is.an('array').with.lengthOf(3)
			.that.deep.contains({
				type: "property",
				name: "fullname",
				value: "Sméagol"
			}).and.contains({
				type: "property",
				name: "type",
				value: "hobbit"
			}).and.contains({
				type: "property",
				name: "website",
				value: "https://lotr.fandom.com/wiki/Gollum"
			});
	});
});