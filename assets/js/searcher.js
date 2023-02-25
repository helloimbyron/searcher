
const JSON = 'https://raw.githubusercontent.com/Bootcamp-Espol/FSD02/main/S03D03/clase/recursos/products.json';
const XML = 'https://raw.githubusercontent.com/Bootcamp-Espol/FSD02/main/S03D03/clase/recursos/products.xml';
let nodes = [];
let search = '';

const container = document.querySelector('#container');
const input = document.querySelector('#text');
const filterbtn = document.querySelector('#filter');

document.addEventListener('DOMContentLoaded', async () => {
  await addNode();
  renderHTML(nodes);
});

input.addEventListener('change', event => search = event.target.value.toLowerCase());

filterbtn.addEventListener('click', () => {
  if (search === '') {
    renderHTML(nodes);
  } else {
    const result = nodes.filter(node => node.product.includes(search) || node.category.includes(search));
    renderHTML(result);
  };
});

async function getProducts (JSON) {
  try {
    let responseJSON = await fetch(JSON); 
    let resultJSON = await responseJSON.json();

    let responseXML = await fetch(XML); 
    let resultXML = await responseXML.text();
    resultXML = (new DOMParser()).parseFromString(resultXML, 'application/xml');

    return { resultJSON, resultXML };
  } catch (error) {
    console.log(error);
  };
};

async function addNode() {
  const { resultJSON: productsJSON, resultXML } = await getProducts(JSON);

  for (product of productsJSON) {
    const { name, price, src, type } = product;
    const HTML = createHTML(name, price, src, type);
    nodes.push({ product: name, category: type, body: HTML } );
  };

  const productsXML = resultXML.getElementsByTagName('product');
  
  for (product of productsXML) {
    const name = product.getElementsByTagName('name')[0].innerHTML;
    const price = product.getElementsByTagName('price')[0].innerHTML;
    const src = product.getElementsByTagName('src')[0].innerHTML;
    const type = product.getElementsByTagName('type')[0].innerHTML;
    const HTML = createHTML(name, price, src, type);
    nodes.push({ product: name, category: type, body: HTML });
  };

};

function createHTML(name, price, src, type) {
  return `
    <div class="col-xl-3 col-md-6 mb-xl-0 mb-4 mt-4">
      <div class="card card-blog card-plain">
        <div class="card-header p-0 mt-n4 mx-3">
          <a class="d-block shadow-xl border-radius-xl">
            <img loading="lazy", src="${src}" alt="${name}" class="img-fluid shadow border-radius-xl">
          </a>
        </div>
        <div class="card-body p-3">
          <p class="mb-0 text-sm">${type.toUpperCase()}</p>
          <a href="javascript:;">
            <h5>
              ${name.toUpperCase()}
            </h5>
          </a>
          <p class="mb-4 text-sm">
            <b>Price: </b> $${parseFloat(price).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  `;
};

function deleteHTML() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  };
};

function renderHTML(result) {
  deleteHTML();
  for (node of result) {
    container.innerHTML += node.body;
  };
};
