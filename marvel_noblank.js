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

//  Make a call using the api
marvel('/characters').then(function(json) {
  var count = 0;
  json.data.results.reduce(function(result, character){

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


    if(imgPath !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
      container.appendChild(characterContainer);
    }
    else{
      count++;
    }
  });
  console.log(count);
});

