const routes = {
  '/home': null, // homepage content is hardcoded in index.html
  '/home/profile': '/pages/profile.html',
  '/home/hometown': '/pages/hometown.html',
  '/home/food': '/pages/food.html',
  '/home/tourist': '/pages/tourist.html'
};

function route() {
  const path = location.pathname;
  const content = document.getElementById('content');

  if (routes[path] === undefined) {
    content.innerHTML = '<h2>404 - Page not found</h2>';
    return;
  }

  if (routes[path] === null) {
    // Home page - already in HTML
    content.innerHTML = `
      <h1>Welcome to My Jakarta</h1>
      <p>This is a personal guide to the beautiful city of Jakarta.</p>
    `;
    return;
  }

  // Load HTML from external file
  $.get(routes[path], function (data) {
    content.innerHTML = data;
  });
}

window.addEventListener('popstate', route);

$(document).ready(function () {
  $('a.nav-link').on('click', function (e) {
    e.preventDefault();
    const href = $(this).attr('href');
    history.pushState(null, null, href);
    route();
  });

  route(); // Initial load
});
