var siteContents;

document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementById('searchBar').addEventListener('input', showResults);
  loadJSON(function(response) {
    siteContents = JSON.parse(response);
    //console.log(siteContents);
  });
});

function showResults(e) {
  const dropdown = document.getElementById('dropdownSearch');
  const dropdownContent = document.getElementById('dropdownContent');

  // Clear previous results if any
  // Source: https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  while (dropdownContent.lastChild) {
    dropdownContent.removeChild(dropdownContent.lastChild);
  }

  let searchInput = e.srcElement.value;
  if (searchInput) {
    if(!dropdown.classList.contains('is-active')) {
      dropdown.classList.toggle('is-active');
    }
    // search json for new stuff
    const postOptions = {
      includeScore: true,
      keys: [
        'title',
        'text',
        'tags.name',
        'categories.name'
      ],
      threshold: 0.3
    };
    const fuse = new Fuse([...siteContents.pages, ...siteContents.posts], postOptions);
    const results = fuse.search(searchInput);

    // Show up to 5 search results
    const maxElements = Math.min(5, results.length);
    for (var i = 0; i < maxElements; i++) {
      const resultItem = document.createElement('a');
      resultItem.classList.add('dropdown-item');
      resultItem.href = results[i].item.path;
      resultItem.textContent = results[i].item.title;
      dropdownContent.appendChild(resultItem);
    }
  } else {
    dropdown.classList.toggle('is-active');
  }
}

// Source: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(callback) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', window.location.origin + '/content.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}
