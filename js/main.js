const URL = `https://jsonplaceholder.typicode.com/`;
let posts = [];
const articleTemplate = document.querySelector(".template");
const postsWrapper = document.querySelector(".posts");
const createPost = (post) => {

const {id, title, body} = post;
const article = articleTemplate.content.cloneNode(true);
article.querySelector(".article__title").textContent = `${id}: ${title}`;
article.querySelector(".article__desc").textContent = body;
article.querySelector(".article__button").dataset.id = id;
return article;
}
const createPosts = () => {

postsWrapper.textContent = "";
const articleFragment = document.createDocumentFragment();
posts.forEach((post) => {

    articleFragment.append(createPost(post))
})
postsWrapper.append(articleFragment)
};

const loadingPosts = document.createElement("p");
loadingPosts.className = "loader";
postsWrapper.append(loadingPosts);

fetch(`${URL}posts`)
.then((res) => res.json())
.then((data) => {
posts = data;
createPosts();
})
.catch((load) => {
    if (load.message === "Failed to fetch") {
    alert("Internetingiz ni yoqing bro)")
    }
});

const addForm = document.querySelector("#form");

addForm.addEventListener("submit", (evt) => {
evt.preventDefault();

const elements = evt.target.elements;
const inputValue = elements.input.value;
const textAreaValue = elements.area.value;
const button = elements.button;

if (inputValue.trim() && textAreaValue) {
    button.disabled = true;
    fetch(`${URL}posts`, {
    method: "POST",
    body: JSON.stringify({
        title: inputValue,
        body: textAreaValue,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((res) => res.json())
    .then((data) => {
        button.disabled = false;
        addForm.reset();
        postsWrapper.prepend(createPost(data))
    })
}
});

postsWrapper.addEventListener("click", (evt) => {
const clickedItem = evt.target;
if (clickedItem.matches(".article__button")) {
const clickedId = clickedItem.dataset.id;
clickedItem.disabled = true;
fetch(`${URL}posts`, {
    method: "DELETE"
})
.then(() => {
    clickedItem.disabled = false;
    const postsRemoveIndex = posts.findIndex(post => post.id === clickedId);
    posts.splice(postsRemoveIndex, 1)
    createPosts();
})
}
});

