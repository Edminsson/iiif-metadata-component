var expect = require('chai').expect;
var should = require('chai').should();
var path = require("path");
var html = path.join(__dirname,'../examples/index.html');
var jsdom = require("jsdom");
var $, Manifold, IIIFComponents, getManifest, document, Manifold, createMetadataComponent, setManifest;

var assert = require("assert");
describe('Ajax test', function(){
    this.timeout(50000);

    function check(thing, name) {
        if (thing) { console.log(name, 'was found' ) }
        else { console.log(name, 'was not found!!!!') }
    }

    beforeEach(function(done){
        jsdom.env({
            file: html,
            features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false,
                MutationEvents           : '2.0'
            },
            done: function (err, window) {
                $ = window.$;
                setManifest = window.setManifest; 
                getManifest = window.getManifest; 
                document = window.document;
                Manifold = window.Manifold;
                createMetadataComponent = window.createMetadataComponent;
                IIIFComponents = window.IIIFComponents;
                done();
            }
        });
    });

    it('createMetadataComponent test', function(done) {
        check(getManifest, 'getManifest');
        var manifestUrl = "https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json";
        var locale = "en";

        return getManifest(manifestUrl, locale).then(function(h){
            console.log("calling createMetadataComponent");
            check(h, 'helper');
            createMetadataComponent(h)
            console.log("after calling createMetadataComponent");
            done();
        });

    });

    it('databind test', function(done) {
        var manifestUrl = "https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json";
        //var manifestUrl = "http://iiif.bodleian.ox.ac.uk/iiif/manifest/60834383-7146-41ab-bfe1-48ee97bc04be.json";
        //var manifestUrl = "https://iiif.riksarkivet.se/arkis!C0000268/manifest";
        var locale = "en";

        return getManifest(manifestUrl, locale).then(function(h){
            check(h, 'helper');
            var component = createMetadataComponent(h);                
            //var compis = myCreateMetadataComponent(h);
            //component.options.limitType = null;
            component.databind();
            //compis.databind();
            done();
        }, function(err) {
            console.log('Nåt i databind-testet failade', err);
            done();
        });
    });

    it('setManifold test', function(done) {
        var manifestUrl = "https://iiif.riksarkivet.se/arkis!C0000268/manifest";
        var locale = "en";

        if (setManifest) {console.log('there is a setManifest function')} else {console.log('no setManifest function')}
        return setManifest(manifestUrl, locale).then(function(){
            var groups = $('.groups').length;
            var items = $('.items').length;    
            console.log('groups', groups);
            console.log('items', items);
            //console.log("setManifest svarade");
            //expect(groups.length).to.equal(2);
            done();
        },
        function(err) {
            console.log('Något gick snett', err);
            done();
        });
    });

});