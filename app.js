import { generateBooks } from './scripts/bookGenerator.js';

let books = [];

const tableBody = document.getElementById('table-body');
const countEl = document.getElementById('count');
const searchInput = document.getElementById('search');
const form = document.getElementById('book-from');

//Загрузка JSON
async function loadBooks() {
    try {
        books = await generateBooks(10);
        render();
    } catch (error) {
        console.error('Ошибка при загрузке книг:', error);
        alert('Не удалось загрузить книги');
    }
}

document.getElementById('reload').addEventListener('click', loadBooks);

function render() {
    tableBody.innerHTML = '';

    const query = searchInput.ariaValueMax.toLowerCase().trim();

    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );

    filtered.forEach(book => {
        const tr = document.createElement('tr');
        tr.dataset.id = book.id;

        tr.innerHTML =
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.gener || ''}</td>
        <td>${book.year ?? ''}</td>
        <td>${book.rating ?? ''}</td>
        <td>
            <button class="edit">Редактировать</button>
            <button class="delete">Удалить</button>
        </td>
        ;

        tableBody.appendChild(tr);
    });

    countEl.textContent = filtered.length;
}