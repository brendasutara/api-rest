const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1/'
});
api.defaults.headers.common['X-API-KEY'] = 'live_p7yUxr31zjSxudmPHAlOvRbdZUbJL2gHzrSIi2Y7oBIiCNoVXBVkg67hxJSGrhv0'

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_p7yUxr31zjSxudmPHAlOvRbdZUbJL2gHzrSIi2Y7oBIiCNoVXBVkg67hxJSGrhv0`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error')

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    
    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
  }
}

async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVOURITES, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'live_p7yUxr31zjSxudmPHAlOvRbdZUbJL2gHzrSIi2Y7oBIiCNoVXBVkg67hxJSGrhv0'
    }
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById('favoriteMichis')
    section.innerHTML = "";

    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Michis favoritos');
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach(michi => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al michi de favoritos');

      img.src = michi.image.url;
      img.width = 150;
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteMichi(michi.id)
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    });
  }
}

async function saveFavouriteMichi(id) {
  //método con axios
  const { data, status } = await api.post('favourites', {
    image_id: id,
  })

  // const res = await fetch(API_URL_FAVOURITES, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-API-KEY': 'live_p7yUxr31zjSxudmPHAlOvRbdZUbJL2gHzrSIi2Y7oBIiCNoVXBVkg67hxJSGrhv0',
  //   },
  //   body: JSON.stringify({
  //     image_id: id
  //   }),
  // });
  // const data = await res.json();

  console.log('Save')
  

  if (status !== 200) {
    spanError.innerHTML = "Hubo un error: " + status + data.message;
  } else {
    console.log('Michi guardado de favorito');
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'X-API-KEY': 'live_p7yUxr31zjSxudmPHAlOvRbdZUbJL2gHzrSIi2Y7oBIiCNoVXBVkg67hxJSGrhv0'
    }
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    console.log('Michi eliminado de favoritos');
    loadFavouriteMichis();
  }
}

async function uploadMichiPhoto () {
  const form = document.getElementById('uploadingForm')
  const formData = new FormData(form);
  
  console.log(formData.get('file'));

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      /* 'Content-Type': 'multipart/form-data', */
      'X-API-KEY': 'live_p7yUxr31zjSxudmPHAlOvRbdZUbJL2gHzrSIi2Y7oBIiCNoVXBVkg67hxJSGrhv0',
    },
    body: formData,
  })
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
  }
  else {
      console.log("Foto de michi cargada :)");
      console.log({ data });
      console.log(data.url);
      saveFavouriteMichi(data.id) //para agregar el michi cargado a favoritos.
  }
}

loadRandomMichis();
loadFavouriteMichis();
