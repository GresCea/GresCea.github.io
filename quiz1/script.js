const routes = {
  '/quiz1/home': 'home/home.html',
  '/quiz1/profile': 'profile/profile.html',
  '/quiz1/hometown': 'hometown/hometown.html',
  '/quiz1/food': 'food/food.html',
  '/quiz1/tourist': 'tourist/tourist.html'
};

function route() {
  let path = location.pathname;

  if (path === '/quiz1' || path === '/quiz1/') {
    history.replaceState(null, null, '/quiz1/home');
    path = '/quiz1/home';
  }

  const content = document.getElementById('content');
  const page = routes[path];

  if (!page) {
    content.innerHTML = '<h2>404 - Page not found</h2>';
    return;
  }

  $.get(page, function (data) {
    content.innerHTML = data;
  }).fail(function () {
    content.innerHTML = '<h2>Error loading content</h2>';
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

  route();
});