// Click app name in header to go to Homepage View

var $homepage = document.querySelector('h1');
var $homepageView = document.querySelector('main[data-view="homepage"]');
var $localButton = document.querySelector('#local-button');
var $localView = document.querySelector('main[data-view="local"]');
var $header = document.querySelector('#dynamic-header');

$homepage.addEventListener('click', function (event) {
  $homepageView.classList.remove('hidden');
  $localView.classList.add('hidden');

  $parentDiv.innerHTML = '';
});

// Click local button to go to Local Breweries View

$localButton.addEventListener('click', function (event) {
  $localView.classList.remove('hidden');
  $homepageView.classList.add('hidden');
  $header.textContent = 'Local Breweries';

  var ipgeo = new XMLHttpRequest();

  ipgeo.open('GET', 'http://api.techniknews.net/ipgeo/');
  ipgeo.responseType = 'json';

  ipgeo.addEventListener('load', function () {
    var latitude = ipgeo.response.lat;
    var longitude = ipgeo.response.lon;
    var openBreweryDB = new XMLHttpRequest();

    openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?by_dist=' + latitude + ',' + longitude);
    openBreweryDB.responseType = 'json';

    openBreweryDB.addEventListener('load', function () {
      var breweries = openBreweryDB.response;

      for (var i = 0; i < breweries.length; i++) {
        $parentDiv.appendChild(renderBreweries(breweries[i]));
      }
    });

    openBreweryDB.send();
  });

  ipgeo.send();

});

// Search for breweries in a city when clicking enter.

var $searchBar = document.querySelector('#search-bar');

$searchBar.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {

    var breweryCount = 0;
    $homepageView.classList.add('hidden');
    $localView.classList.remove('hidden');
    $parentDiv.innerHTML = '';
    var city = $searchBar.value;
    var openBreweryDB = new XMLHttpRequest();

    openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries?by_city=' + city);
    openBreweryDB.responseType = 'json';

    openBreweryDB.addEventListener('load', function () {
      var breweries = openBreweryDB.response;

      for (var i = 0; i < breweries.length; i++) {
        $parentDiv.appendChild(renderBreweries(breweries[i]));
        breweryCount++;
      }

      if (breweryCount > 0) {
        $header.textContent = city + ' ' + 'Breweries';
      } else {
        $header.textContent = 'No Breweries Found in' + ' ' + '"' + city + '"';
      }
      $searchBar.value = '';
    });

    openBreweryDB.send();
  }
});

// Function to Render Brewery Cards

var $parentDiv = document.querySelector('#parent-div');

function renderBreweries(breweries) {
  var $col3 = document.createElement('div');
  $col3.setAttribute('class', 'column-half');

  var $breweryCardFlex = document.createElement('div');
  $breweryCardFlex.setAttribute('class', 'brewery-card-flex');
  $col3.appendChild($breweryCardFlex);

  var $breweryCard = document.createElement('div');
  $breweryCard.setAttribute('class', 'brewery-card');
  $breweryCardFlex.appendChild($breweryCard);

  var $row = document.createElement('div');
  $row.setAttribute('class', 'row');
  $breweryCard.appendChild($row);

  var $col1 = document.createElement('div');
  $col1.setAttribute('class', 'column-half');
  $col1.setAttribute('class', 'heart-container');
  $row.appendChild($col1);

  var $infoFlex = document.createElement('div');
  $infoFlex.setAttribute('class', 'info-flex');
  $col1.appendChild($infoFlex);

  var $breweryInfo = document.createElement('div');
  $breweryInfo.setAttribute('class', 'brewery-info');
  $infoFlex.appendChild($breweryInfo);

  var $h3 = document.createElement('h3');
  if (breweries.name === null) {
    breweries.name = '';
  } else {
    $h3.textContent = breweries.name;
    $breweryInfo.appendChild($h3);
  }

  var $ul = document.createElement('ul');
  $breweryInfo.appendChild($ul);

  var $li1 = document.createElement('li');
  var phone;
  if (breweries.phone) {
    phone = '(' + breweries.phone.slice(0, 3) + ')' + ' ' + breweries.phone.slice(3, 6) + '-' + breweries.phone.slice(6);
  } else {
    phone = '';
  }
  $li1.textContent = phone;
  $ul.appendChild($li1);

  var $li2 = document.createElement('li');
  var street;
  var city;
  var state;
  if (breweries.street === null) {
    street = '';
  } else {
    street = breweries.street + ', ';
  }
  if (breweries.city === null) {
    city = '';
  } else {
    city = breweries.city + ', ';
  }
  if (breweries.state === null) {
    state = '';
  } else {
    state = breweries.state;
  }
  $li2.textContent = street + city + state;
  $ul.appendChild($li2);

  var $li3 = document.createElement('li');
  $ul.appendChild($li3);

  var $a = document.createElement('a');
  if (breweries.website_url) {
    $a.textContent = breweries.website_url.slice(7);
    $a.setAttribute('href', breweries.website_url);
    $a.setAttribute('target', '_blank');
  }
  $li3.appendChild($a);

  var $i1 = document.createElement('i');

  $i1.setAttribute('class', 'far fa-heart fa-2x');

  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].id === breweries.id) {
      $i1.setAttribute('class', 'fas fa-heart fa-2x');
    }
  }

  $i1.setAttribute('id', 'heart');
  $i1.setAttribute('data-id', breweries.id);
  $col1.appendChild($i1);

  var $col2 = document.createElement('div');
  $col2.setAttribute('class', 'column-half');
  $row.appendChild($col2);

  var $mapFlex = document.createElement('div');
  $mapFlex.setAttribute('class', 'map-flex');
  $col2.appendChild($mapFlex);

  var $breweryMap = document.createElement('div');
  $breweryMap.setAttribute('class', 'brewery-map');
  $mapFlex.appendChild($breweryMap);

  var $map = document.createElement('iframe');

  if (breweries.latitude && breweries.longitude) {
    $map.setAttribute('src', 'https://maps.google.com/maps?q=' + breweries.latitude + ',' + breweries.longitude + '&z=15&output=embed');
    $map.setAttribute('width', '100%');
    $map.setAttribute('height', '100%');
    $map.setAttribute('frameborder', '0');
    $map.setAttribute('style', 'border: 0;');
    $breweryMap.appendChild($map);
  } else {
    var $img = document.createElement('img');
    $img.setAttribute('class', 'map-image');
    $img.setAttribute('src', 'https://static-00.iconduck.com/assets.00/map-marker-slash-icon-500x512-rym1tj3e.png');
    $breweryMap.appendChild($img);
  }

  return $col3;
}

// Event listener to toggle hearts

$parentDiv.addEventListener('click', function (event) {
  if (event.target.matches('#heart')) {
    if (event.target.className === 'far fa-heart fa-2x') {
      event.target.className = 'fas fa-heart fa-2x';
      var id = event.target.getAttribute('data-id');

      var openBreweryDB = new XMLHttpRequest();

      openBreweryDB.open('GET', 'https://api.openbrewerydb.org/breweries/' + id);
      openBreweryDB.responseType = 'json';

      openBreweryDB.addEventListener('load', function () {
        data.favorites.push(openBreweryDB.response);
      });

      openBreweryDB.send();

    } else {
      event.target.className = 'far fa-heart fa-2x';

      for (var x = 0; x < data.favorites.length; x++) {
        if (Number.parseInt(event.target.getAttribute('data-id')) === data.favorites[x].id) {
          data.favorites.splice(x, 1);
          if ($header.textContent === 'Favorites') {
            $parentDiv.innerHTML = '';
            for (var i = 0; i < data.favorites.length; i++) {
              $parentDiv.appendChild(renderBreweries(data.favorites[i]));
            }
          }
        }
      }
    }
  }
});

// Rendering back saved list.

var $favorites = document.querySelector('#favorites-list');

$favorites.addEventListener('click', function (event) {
  $parentDiv.innerHTML = '';
  $localView.classList.remove('hidden');
  $homepageView.classList.add('hidden');
  $header.textContent = 'Favorites';

  for (var i = 0; i < data.favorites.length; i++) {
    $parentDiv.appendChild(renderBreweries(data.favorites[i]));
  }
});
