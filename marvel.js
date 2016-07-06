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

function marvelFactory(config) {
  return function(path) {
    var timestamp = new Date().getTime();
    var hash = CryptoJS.MD5(timestamp + config.privateKey + config.publicKey).toString();
    var url = config.hostname + '/v' + config.version + '/public' + path + '?apikey=' + config.publicKey + '&ts=' + timestamp + '&hash=' + hash;
    console.log(url);

    return fetchJSON(url);
  }
}

// Get an instance of the marvel api
var marvel = marvelFactory({
  hostname: 'http://gateway.marvel.com',
  publicKey: 'c5ebb123335240358c2744cde0f38b7e',
  privateKey: 'cff3343714de139da0173348487355979eda8406',
  version: '1'
});
///////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////

//  Make a call using the api
marvel('/characters').then(function(json) {
  json.data.results.map(function(character){

    var characterContainer = document.createElement('character');

    var name = character.name;
    var charNameTag = document.createElement('charName');
    var charNameTagTextNode = document.createTextNode(name);
    charNameTag.appendChild(charNameTagTextNode);

    var charNameLinkNode = document.createElement('a');
    charNameLinkNode.setAttribute('target', '_blank');
    charNameLinkNode.setAttribute('href', 'https://www.google.com/#q=' + encodeURIComponent(name));
    charNameLinkNode.appendChild(charNameTagTextNode);

    charNameTag.appendChild(charNameLinkNode);

    var imgPath = character.thumbnail.path + '.' + character.thumbnail.extension;
    var img = document.createElement('img'); // Create an element node
    img.setAttribute('src', imgPath); // Set some properties on the node
    img.setAttribute('title', name);

    characterContainer.appendChild(charNameTag);
    characterContainer.appendChild(img);

    var container = document.querySelector('characters');
    container.appendChild(characterContainer);

  });
});

