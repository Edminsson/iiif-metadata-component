var expect = require('chai').expect;
var should = require('chai').should();
var path = require("path");
var html = path.join(__dirname,'../examples/index.html');
var jsdom = require("jsdom");
var $, Manifold, IIIFComponents;

function myCreateMetadataComponent(helper) {
    return component = new IIIFComponents.MetadataComponent({
        canvasDisplayOrder: "attribution, title",
        canvases: [helper.getCanvasByIndex(0), helper.getCanvasByIndex(1)],
        canvasLabels: "Left page, Right page",
        canvasExclude: "attribution",
        copyToClipboardEnabled: false,
        element: "#metadata",
        helper: helper,
        manifestDisplayOrder: "attribution, publication date, license, title",
        manifestExclude: "license, attribution",
        range: helper.getRanges()[0],
        sanitizer: function(html) {
            return html;
        },
        showAllLanguages: false
    });

}

var assert = require("assert");
describe('Ajax test', function(){
    this.timeout(50000);

    function check(thing, name) {
        if (thing) {
            console.log(name, 'was found' )
        }
        else {
            console.log(name, 'was not found!!!!')
        }

    }

    it('extremely simple test', function(done){
        jsdom.env({
            html: '<html><head></head><body><div id="one">uno</div></body></html>',
            done: function(err, window) {
                var document = window.document;
                var one = document.getElementById("one");
                check(one, "one");
                expect(one.innerHTML).to.equal("uno");
                done();
            }
        });
    });

    it('very simple test from jsdom', function(done){

        jsdom.env(
        '<p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom!</a></p>',
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
            check(window.$,'jQ');
            console.log("contents of a.the-link:", window.$("a.the-link").text());
            done();
        }
        );

    });

    it('very simple test', function(done){

        jsdom.env(
        '<p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom!</a></p>',
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
            $ = window.$;
            var manifoldUrl = 'https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json';
            check($, "jQuery");
            return $.get(manifoldUrl).then(function(h){
                console.log('ANROPET LYCKADES', h.metadata.length);
                expect(h.metadata.length).to.equal(12);
                done();
            }, function(){
                console.log('ANROPET FAILADE');
                done();
            });                
        }
        );

    });


    it('simple ajax test', function(done) {

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
                var manifoldUrl = 'https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json';

                return $.get(manifoldUrl).then(function(h){
                    console.log('Ajaxanropet mot manifest lyckades', h.metadata.length);
                    expect(h.metadata.length).to.equal(12);
                    done();
                }, function(){
                    console.log('ANROPET FAILADE');
                    done();
                });

            }
        });

    });

    it('simple loadManifest', function(done) {

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
                Manifold = window.Manifold;
                var manifestUrl = "https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json";
                var locale = "en";

                check(Manifold, "Manifold");
                check(Manifold.loadManifest, "Manifold.loadManifest");

                return Manifold.loadManifest({
                    iiifResourceUri: manifestUrl,
                    collectionIndex: 0,
                    manifestIndex: 0,
                    locale: locale
                }).then(function(h){
                    console.log('här är jag', h.options.iiifResourceUri.length);
                    expect(h.options.iiifResourceUri.length).to.equal(75);
                    done();
                });

            }
        });

    });

    it('getManifold test', function(done) {

        jsdom.env({
            file: html,
            features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false,
                MutationEvents           : '2.0'
            },
            done: function (err, window) {
                var $ = window.$;
                var getManifest = window.getManifest; 

                var document = window.document;
                var Manifold = window.Manifold;
                var IIIFComponents = window.IIIFComponents;

                check(getManifest, 'getManifest');

                var manifestUrl = "https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json";
                var locale = "en";

                return getManifest(manifestUrl, locale).then(function(h){
                    console.log("getManifest svarade", h.options.iiifResourceUri.length);
                    expect(h.options.iiifResourceUri.length).to.equal(75);
                    done();
                });

            }
        });

    });

    it('createMetadataComponent test', function(done) {

        jsdom.env({
            file: html,
            features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false,
                MutationEvents           : '2.0'
            },
            done: function (err, window) {
                var $ = window.$;
                var getManifest = window.getManifest; 

                var document = window.document;
                var Manifold = window.Manifold;
                var createMetadataComponent = window.createMetadataComponent;
                IIIFComponents = window.IIIFComponents;

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

            }
        });

    });

    it('databind test', function(done) {

        jsdom.env({
            file: html,
            features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false,
                MutationEvents           : '2.0'
            },
            done: function (err, window) {
                var $ = window.$;
                var getManifest = window.getManifest; 

                var document = window.document;
                var Manifold = window.Manifold;
                var createMetadataComponent = window.createMetadataComponent;
                IIIFComponents = window.IIIFComponents;

                check(getManifest, 'getManifest');

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

            }
        });

    });



    it('setManifold test', function(done) {

        jsdom.env({
            file: html,
            features: {
                FetchExternalResources: ["script"],
                ProcessExternalResources: ["script"],
                SkipExternalResources: false,
                MutationEvents           : '2.0'
            },
            done: function (err, window) {
                var $ = window.$;
                var setManifest = window.setManifest; 

                var document = window.document;
                var Manifold = window.Manifold;
                IIIFComponents = window.IIIFComponents;


                //var manifestUrl = "https://tomcrane.github.io/scratch/manifests/vdc_100000004987.0x000001.json";
                //var manifestUrl = "http://iiif.bodleian.ox.ac.uk/iiif/manifest/60834383-7146-41ab-bfe1-48ee97bc04be.json";
                var manifestUrl = "https://iiif.riksarkivet.se/arkis!C0000268/manifest";
                var locale = "en";

                if (setManifest) {console.log('there is a setManifest function')} else {console.log('no setManifest function')}
                return setManifest(manifestUrl, locale).then(function(){
                    //var groups = $('.groups').length;
                    //var items = $('.items').length;    
                    //console.log("setManifest svarade");
                    //expect(groups.length).to.equal(2);
                    done();
                },
                function(err) {
                    console.log('Något gick snett', err);
                    done();
                });

            }
        });

    });


});