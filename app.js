import { generateBooks } from './scripts/bookGenerator.js'; // Импорт функции генерации книг

let books = []; // Глобальный массив для хранения всех книг (источник истины)

const tableBody = document.getElementById('table-body'); // Ссылка на tbody таблицы
const countEl = document.getElementById('count'); // Ссылка на элемент счётчика книг
const searchInput = document.getElementById('search'); // Ссылка на поле поиска
const form = document.getElementById('book-form'); // Ссылка на форму добавления/редактирования

//Загрузка JSON
async function loadBooks() { // Асинхронная функция загрузки книг
    try { // Блок обработки ошибок
        books = await generateBooks(10); // Получаем 10 книг из API и сохраняем в массив
        render(); // Отрисовываем таблицу
    } catch (error) { // Если произошла ошибка
        console.error('Ошибка при загрузке книг:', error); // Выводим ошибку в консоль
        alert('Не удалось загрузить книги'); // Показываем уведомление пользователю
    }
}

document.getElementById('reload').addEventListener('click', loadBooks); // При клике на reload загружаем книги

function render() { // Функция отрисовки таблицы
    tableBody.innerHTML = ''; // Очищаем содержимое tbody

    const query = searchInput.value.toLowerCase().trim(); // Получаем поисковый запрос (в нижний регистр, без пробелов)

    const filtered = books.filter(book => // Фильтруем книги по поиску
        book.title.toLowerCase().includes(query) || // Название содержит запрос
        book.author.toLowerCase().includes(query) // Или автор содержит запрос
    );

    filtered.forEach(book => { // Для каждой отфильтрованной книги
        const tr = document.createElement('tr'); // Создаём строку таблицы
        tr.dataset.id = book.id; // Сохраняем id книги в data-атрибут строки

        tr.innerHTML = ` // Заполняем HTML-содержимое строки
        <td>${book.title}</td> // Ячейка с названием
        <td>${book.author}</td> // Ячейка с автором
        <td>${book.genre || ''}</td> // Ячейка с жанром (или пусто)
        <td>${book.year ?? ''}</td> // Ячейка с годом (или пусто, если null)
        <td>${book.rating ?? ''}</td> // Ячейка с рейтингом (или пусто)
        <td>
            <button class="edit">Редактировать</button> // Кнопка редактирования
            <button class="delete">Удалить</button> // Кнопка удаления
        </td>
        `;

        tableBody.appendChild(tr); // Добавляем строку в таблицу
    });

    countEl.textContent = filtered.length; // Обновляем счётчик отображаемых книг
}
tableBody.addEventListener('click', e => { // Делегирование событий на tbody (один обработчик для всех кнопок)
    const row = e.target.closest('tr'); // Находим ближайшую строку (родительскую)
    if (!row) return; // Если строки нет (клик не по кнопке в строке) - выходим

    const id = row.dataset.id; // Получаем id книги из data-атрибута строки

    if (e.target.classList.contains('delete')) { // Если кликнули на кнопку "Удалить"
        if (!confirm('Действительно удалить книгу?')) return; // Запрос подтверждения (если отмена - выходим)

        books = books.filter(book => book.id !== id); // Удаляем книгу из массива (фильтром)
        render(); // Перерисовываем таблицу
    }

    if (e.target.classList.contains('edit')) { // Если кликнули на кнопку "Редактировать"
        const book = books.find(b => b.id === id); // Находим книгу по id в массиве
        if (book) fillForm(book); // Если книга найдена, заполняем форму её данными
    }
});

form.addEventListener('submit', e => { // Обработчик отправки формы
    e.preventDefault(); // Отменяем стандартную отправку (перезагрузку страницы)
    
    const formData = new FormData(form); // Собираем данные формы
    const data = Object.fromEntries(formData); // Преобразуем FormData в обычный объект

    const bookData = normalizeBook(data); // Нормализуем данные

    if (data.id) { // Если в данных есть id (редактирование)
        const book = books.find(b => b.id === data.id); // Находим книгу по id
        if (book) { // Если книга найдена
            Object.assign(book, bookData); // Обновляем её свойства новыми данными
        }
    } else { // Если id нет (добавление новой книги)
        books.push({ // Добавляем в массив новый объект
            id: crypto.randomUUID(), // Генерируем уникальный id
            ...bookData // Добавляем все поля из bookData
        });
    }

    form.reset(); // Очищаем поля формы
    form.querySelector('[name="id"]').value = ''; // Очищаем скрытое поле id (важно!)
    render(); // Перерисовываем таблицу
});

function fillForm(book) { // Функция заполнения формы данными книги
    form.querySelector('[name="id"]').value = book.id; // Устанавливаем id
    form.querySelector('[name="title"]').value = book.title; // Устанавливаем название
    form.querySelector('[name="author"]').value = book.author; // Устанавливаем автора
    form.querySelector('[name="genre"]').value = book.genre || ''; // Устанавливаем жанр (или пусто)
    form.querySelector('[name="year"]').value = book.year || ''; // Устанавливаем год (или пусто)
    form.querySelector('[name="rating"]').value = book.rating || ''; // Устанавливаем рейтинг (или пусто)
}

searchInput.addEventListener('input', render); // При вводе в поиск - перерисовываем таблицу (фильтрация)

document.getElementById('export').addEventListener('click', () => { // Обработчик кнопки экспорта
    const json = JSON.stringify(books, null, 2); // Преобразуем массив книг в JSON-строку с отступами
    const blob = new Blob([json], { type: 'application/json' }); // Создаём Blob-объект из JSON
    const url = URL.createObjectURL(blob); // Создаём временный URL для Blob

    const link = document.createElement('a'); // Создаём элемент ссылки
    link.href = url; // Устанавливаем href = временный URL
    link.download = 'book.json'; // Задаём имя файла для скачивания
    link.click(); // Программно кликаем по ссылке (скачивание)

    URL.revokeObjectURL(url); // Освобождаем временный URL (чистим память)
});

loadBooks(); // Загружаем книги при старте приложения
