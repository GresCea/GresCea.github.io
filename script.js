const routes = {
  '/quiz1': null, // homepage content is hardcoded in index.html
  '/quiz1/profile': '/pages/profile.html',
  '/quiz1/hometown': '/pages/hometown.html',
  '/quiz1/food': '/pages/food.html',
  '/quiz1/tourist': '/pages/tourist.html'
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
