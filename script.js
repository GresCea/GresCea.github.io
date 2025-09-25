const routes = {
  '/quiz1': null, // Used for internal routing
  '/quiz1.html': null, // Handle direct access to quiz1.html
  '/quiz1/profile': '/pages/profile.html',
  '/quiz1/hometown': '/pages/hometown.html',
  '/quiz1/food': '/pages/food.html',
  '/quiz1/tourist': '/pages/tourist.html'
};

function route() {
  let path = location.pathname;

  // Normalize common home paths to /quiz1
  if (path === '/quiz1.html') {
    path = '/quiz1';
  }

  const content = document.getElementById('content');

  if (routes[path] === undefined) {
    content.innerHTML = '<h2>404 - Page not found</h2>';
    return;
  }

  if (routes[path] === null) {
    // Home page - keep existing HTML content
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
