let wrapper = document.createElement("div");
wrapper.className = "wrapper";
document.body.append(wrapper);

let content = document.createElement("div");
content.className = "content";
wrapper.append(content);

let divInput = document.createElement("div");
divInput.className = "divInput";
content.append(divInput);

let input = document.createElement("input");
input.placeholder = "Enter the name of the repository...";
input.className = "input";
divInput.append(input);

let links = document.createElement("div");
links.className = "links";
divInput.append(links);

let users = document.createElement("div");
users.className = "users";
divInput.append(users);

input.addEventListener("keyup", debounce(showRequest, 400));

function createLinks(data) {
  let userLink = document.createElement("div");
  userLink.insertAdjacentHTML(
    "afterbegin",
    `
  <li class = 'lishechka'>${data}</li>
  `
  );
  return userLink;
}

function createCards(data) {
  let userItem = document.createElement("div");
  userItem.className = "users_item";
  userItem.insertAdjacentHTML(
    "afterbegin",
    `<div class = 'text'>Name: ${data.name}</div><div class = 'text'>Owner: ${data.owner["login"]}</div><div class = 'text'>Stars: ${data.stargazers_count}</div>`
  );

  userItem.append(createDeleteBtnEl(userItem));

  return userItem;
}

function createDeleteBtnEl(elem) {
  const element = document.createElement("button");
  element.classList.add("delete-button");
  element.addEventListener("click", () => {
    elem.remove();
  });
  element.removeEventListener("click", () => {
    elem.remove();
  });

  return element;
}

function debounce(fn, ms) {
  let timer;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timer);
    timer = setTimeout(fnCall, ms);
  };
}

async function showRequest(e) {
  input.value = input.value.trim();
  if (input.value.length !== 0 && input.value !== "") {
    links.style.display = "block";
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`
    );

    if (response.ok) {
      let data = await response.json();
      let arr = data.items.map((item) => {
        return item.name;
      });
      links.textContent = "";

      for (let i = 0; i < arr.length; i++) {
        links.append(createLinks(arr[i]));
      }

      links.addEventListener("click", (e) => {
        for (let i = 0; i < data.items.length; i++) {
          if (e.target.innerText == data.items[i].name) {
            users.prepend(createCards(data.items[i]));

            e.target.innerText = "";
            links.textContent = "";
          }
        }
        input.value = "";
      });
      links.removeEventListener("click", (e) => {
        for (let i = 0; i < data.items.length; i++) {
          if (e.target.innerText == data.items[i].name) {
            users.prepend(createCards(data.items[i]));

            e.target.innerText = "";
            links.textContent = "";
          }
        }
        input.value = "";
      });
    }
  } else {
    links.style.display = "none";
  }
}
