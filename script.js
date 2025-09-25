const routes = {
  '/quiz1': '/quiz1/home/home.html',
  '/quiz1/profile': '/quiz1/profile/profile.html',
  '/quiz1/hometown': '/quiz1/hometown/hometown.html',
  '/quiz1/food': '/quiz1/food/food.html',
  '/quiz1/tourist': '/quiz1/tourist/tourist.html'
};

function route() {
  const path = location.pathname;
  const content = document.getElementById('content');
  const page = routes[path];

  if (page === undefined) {
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
