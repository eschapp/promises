function fetchJSON(url) {
  return fetch(url).then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      console.log("Oops, we haven't got JSON!");
    }
  });
}

function optionsToString(options) {
  var preppedOptions = {};
  var preppedOptionsString = '';
  for(opt in options) {
    var prop = opt;
    var value = options[prop];
    preppedOptions[opt] = encodeURIComponent(options[opt]);
    preppedOptionsString += prop + '=' + value + '&';
  }
  return preppedOptionsString;
}

function marvelFactory(config) {
  return function(path, options) {
    var preppedOptions = optionsToString(options);
    var timestamp = new Date().getTime();
    var hash = CryptoJS.MD5(timestamp + config.privateKey + config.publicKey).toString();
    var url = config.hostname + '/v' + config.version + '/public' + path + '?' + preppedOptions + 'apikey=' + config.publicKey + '&ts=' + timestamp + '&hash=' + hash;
    console.log(url);

    return fetchJSON(url);
  }
}

// Get an instance of the marvel api
var marvel = marvelFactory({
  hostname: 'http://gateway.marvel.com',
  publicKey: '05a3448298ed9a5694ebd41543a831cc',
  privateKey: 'b99daadb62bcad353720f66de1dba592b0604ddf',
  version: '1'
});

// 1. Sign up for the marvel api: https://developer.marvel.com
// 2. Get your public and private key from: https://developer.marvel.com/account
// 3. Replace the above config with your own public and private key
// 4. On the account page, a new allowed referer: localhost
// 5. Make sure you hit update!
// 6. Fork jimthedev/promises on github
// 7. Clone <<yourusername>>/promises from github to your computer
// 8. cd in your promises folder and run `npm install`.
// 9. Modify marvel.js to add the name of the character as well.
// 10.You can run a server with: `./node_modules/.bin/http-server`
// 11.Once the server is running, you can see the code at:
//       http://localhost:8080/marvel.html
//

// If I just use $, I'm just querying
function $(selector, context) {
  return new $.fn.init(selector);
}

$.fn = $.prototype = {
};
$.fn.init = function(selector, context) {

  // null, '', undefined, false
  if (!selector) {
	  return this;
	}

  // It is a string, so we have to guess
  // what the user was trying to do
  if(typeof selector === 'string') {
    if(selector.charAt(0) === '<' && selector.charAt(selector.length-1) === '>' && selector.length >= 3) {

      //REGEX FOR SINGLE HTML TAGS
      var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);

      // REGEX TO GET TAG NAME FROM HTML STRINGS!
      var regex = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;

      // Locate single tags
      var matchResult = rsingleTag.exec(selector);

      if(matchResult && matchResult[1]) {

        // new element
        return {
          el: document.createElement(matchResult[1]),
          attr: function(prop, val) {
            this.el.setAttribute(prop, val);
          },
          append: function(child) {
            this.el.appendChild(child.el);
          },
          text: function(str) {
            this.el.appendChild(document.createTextNode(str));
          }
        }
        // return {
        //   attr: function(val, props) {

        //     console.log(val, props);
        //   },
        //   el: function() {
        //     return document.createElement(matchResult[1]);
        //   }
        // }
      }
    } else if (selector.charAt(0) === '#') {
      return {
        el: document.getElementById(selector),
        attr: function(prop, val) {
          this.el.setAttribute(prop, val);
        },
        append: function(child) {
          this.el.appendChild(child.el);
        },
        text: function(str) {
          this.el.appendChild(document.createTextNode(str));
        }
      }
    } else {
      return {
        el: document.querySelector(selector),
        attr: function(prop, val) {
          this.el.setAttribute(prop, val);
        },
        append: function(child) {
          this.el.appendChild(child.el);
        },
        text: function(str) {
          this.el.appendChild(document.createTextNode(str));
        }

      }
    }
  }
};
// // If I use $.create, I'm creating
// $.create = function(elementName) {
//   return document.createElement(elementName);
// }

$.createText = function(text) {
  return document.createTextNode(text);
}

$.setAttribute = function(el, attr, value) { // this
  return el.setAttribute(attr, value);
};

$.attr = function(childElement) {
  console.trace(parentElement);
  return this.appendChild(childElement);
}

function makeFilePath(path, extension) {
  return path + '.' + extension;
}

function marvelImageFound(path) {
  return (path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg');
}

// With jquery:
// var characters = $('characters');
// var character = $.creare('character');
//
// characters.appendChild(character);

// Make a call using the api
marvel('/characters', { limit: 100, offset: 300 }).then(function(json) {

  // Add the character tag to the overall list of characters
  var container = $('characters');

  var noImageArray = json.data.results.filter(function mapOverCharacters(character){

    // START HERE WITH BUILDING THE STRUCTURE

    // <character></character>
    var characterContainer = $('<character />');

    var overlay = $('<overlay />');
    var slide = $('<slide />');
    slide.text(character.name);
     // Any operations specific to this character
    var imgPath = makeFilePath(character.thumbnail.path, character.thumbnail.extension);
    var name = character.name;

    var img = $('<img />'); // Create an element node
    img.attr('src', imgPath); // Set some properties on the node

    var nameTag = $('<charactername />'); // <character-name>
    var nameWrapper = $('<namewrapper />');
    nameWrapper.append(slide);
    characterContainer.append(nameWrapper);
    var nameLinkNode = $('<a />'); // <a>

    nameLinkNode.attr('href', 'https://www.google.com/#q=' + encodeURIComponent(name));
    //nameLinkNode.append(nameTextNode); // <a href="...">3D-Man</a>
    console.dir(nameTag);
    nameTag.append(nameLinkNode); // <character-name><a href="...">3D-man</a></character-name>

    // Add different properties for a single character
    //characterContainer.append(nameTag); // <character><character-name>3D-Man</character-name></character>
    characterContainer.append(overlay);
    characterContainer.append(img); // <character><character-name>3D-Man</character-name><img src="..." /></character>

    var imgFound = marvelImageFound(imgPath);
    if(imgFound) {
      container.append(characterContainer);
    }
    return !imgFound;

  });
  var charactersMetadata = $('characters-metadata');
  //var hiddenImagesTextNode = $.createText(noImageArray.length + ' characters were hidden.');
  //charactersMetadata.append(hiddenImagesTextNode);
});

