

self.addEventListener('fetch', (event) => {
  event.respondWith(new Promise((resolve, reject) => {
    try {
      const req = event.request;
      const url = new URL(req.url);
      const path = url.pathname;
      if (path.match(/__download__/)) {
        download().then(resolve).catch(error => {
          resolve(make_error(error));
        });
      }
      if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
      }
      //request = credentials: 'include'
      fetch(event.request).then(resolve).catch(reject);
    } catch(error) {
      resolve(make_error(error));
    }
  }));
});

function response(data, options) {
  const blob = new Blob([data], {
    type: 'text/plain'
  });
  return new Response(blob, options);
}

async function download() {
  const text = await fetch('./hacker.txt').then(res => res.text());
  return response(text);
}

function make_error(err) {
  return response(error.message + '\n' + error.stack);
}
