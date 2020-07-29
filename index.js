const data = Array.from({ length: 100 })
  .map((_, index) => `Item ${index}`);

const state = {
  currentPage: 1,
  perPage: 5,
  totalPage: Math.ceil(data.length/5),
  maxVisibleButtons: 5,
}

const html = {
  get(element) {
    return document.querySelector(element);
  },
}

const controls = {
  next() {
    state.currentPage += 1;

    const lastPage = state.currentPage > state.totalPage;

    if (lastPage) {
      state.currentPage -= 1;
    }
  },
  previous() {
    state.currentPage -= 1;

    if (state.currentPage < 1) {
      state.currentPage += 1;
    }
  },
  goTo(page) {
    if (page > state.totalPage) {
      page = state.totalPage;
    } else if (page < 1) {
      page = 1;
    }

    state.currentPage = page;
  },
  createListener() {
    html.get('.first').addEventListener('click', () => {
      controls.goTo(1);
      update();
    });

    html.get('.last').addEventListener('click', () => {
      controls.goTo(state.totalPage);
      update();
    });

    html.get('.next').addEventListener('click', () => {
      controls.next();
      update();
    });

    html.get('.prev').addEventListener('click', () => {
      controls.previous();
      update();
    });
  },
}

const list = {
  create(item) {
    const div = document.createElement('div');

    div.classList.add('item');
    div.innerHTML = item;

    html.get('.list').appendChild(div);
  },
  update() {
    html.get('.list').innerHTML = "";

    const page = state.currentPage - 1;
    const start = page * state.perPage;
    const end = start + state.perPage;

    const paginatedItems = data.slice(start, end);

    paginatedItems.forEach(list.create);
  },
}

const buttons = {
  create(number) {
    const button = document.createElement('div');

    button.innerHTML = number;

    if (state.currentPage === number) {
      button.classList.add('active');
    }

    button.addEventListener('click', (event) => {
      const page = event.target.innerText;

      controls.goTo(+page);
      update();
    });

    html.get('.pagination .numbers').appendChild(button);
  },
  update() {
    html.get('.pagination .numbers').innerHTML = "";
  
    const { maxLeftButtons, maxRightButtons } = buttons.calculateVisible();

    for (let page = maxLeftButtons; page <= maxRightButtons; page++) {
      buttons.create(page);      
    }
  },
  calculateVisible() {
    const { maxVisibleButtons } = state;

    let maxLeftButtons = (state.currentPage - Math.floor(maxVisibleButtons / 2));
    let maxRightButtons = (state.currentPage + Math.floor(maxVisibleButtons / 2));
    
    if (maxLeftButtons < 1) {
      maxLeftButtons = 1;
      maxRightButtons = maxVisibleButtons;
    }

    if (maxRightButtons > state.totalPage) {
      maxLeftButtons = state.totalPage - (maxVisibleButtons - 1);
      maxRightButtons = state.totalPage;

      if (maxLeftButtons < 1) maxLeftButtons = 1;
    }

    return { 
      maxLeftButtons, 
      maxRightButtons 
    };
  },
}

function update() {
  list.update();
  buttons.update();
}

function init() {
  update();

  controls.createListener();
} 

init();
