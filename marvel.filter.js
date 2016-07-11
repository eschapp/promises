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

// Make a call using the api
marvel('/characters').then(function(json) {

  // Add the character tag to the overall list of characters
  var container = document.querySelector('characters');

  var noImageArray = json.data.results.filter(function(character){
    // DESIRED STRUCTURE:
    //
    // <characters>
    //   <character>
    //     <character-name><a href="https://www.google.com/#q=******">3D-Man</a></character-name>
    //     <img src="thumbnail.jpg" />
    //   </character>
    //   <character>
    //     <character-name>Ajax</character-name>
    //     <img src="thumbnail.jpg" />
    //   </character>
    //   <character>
    //     <character-name>Astrelle</character-name>
    //     <img src="thumbnail.jpg" />
    //   </character>
    // </characters>

    // START HERE WITH BUILDING THE STRUCTURE

    // <character></character>
    var characterContainer = document.createElement('character');

     // Any operations specific to this character
    var imgPath = character.thumbnail.path + '.' + character.thumbnail.extension;
    var name = character.name;

    var img = document.createElement('img'); // Create an element node
    img.setAttribute('src', imgPath); // Set some properties on the node

    var nameTag = document.createElement('character-name'); // <character-name>

    var nameTextNode = document.createTextNode(name); // 3D-Man
    var nameLinkNode = document.createElement('a'); // <a>
    nameLinkNode.setAttribute('href', 'https://www.google.com/#q=' + encodeURIComponent(name));
    nameLinkNode.appendChild(nameTextNode); // <a href="...">3D-Man</a>

    nameTag.appendChild(nameLinkNode); // <character-name><a href="...">3D-man</a></character-name>

    // Add different properties for a single character
    characterContainer.appendChild(nameTag); // <character><character-name>3D-Man</character-name></character>
    characterContainer.appendChild(img); // <character><character-name>3D-Man</character-name><img src="..." /></character>

    if(imgPath === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
      return true;
    } else { // there is an image
      container.appendChild(characterContainer);
      return false;
    }

  });
  var charactersMetadata = document.querySelector('characters-metadata');
  var hiddenImagesTextNode = document.createTextNode(noImageArray.length + ' characters were hidden.');
  charactersMetadata.appendChild(hiddenImagesTextNode);
});

