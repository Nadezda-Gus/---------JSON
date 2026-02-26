// Неизменяемый массив с жанрами для поиска книг в Open Library
const SUBJECTS = [                      // Объявление константы с массивом жанров
    'fantasy',                          // Жанр "фэнтези"
    'science_fiction',                  // Жанр "научная фантастика"
    'romance',                          // Жанр "романтика"
    'history',                          // Жанр "история"
    'horror',                           // Жанр "ужасы"
    'love'                              // Жанр "любовь"
];

function randomItem(arr) {              // Функция для получения случайного элемента массива
    return arr[Math.floor(Math.random() * arr.length)]; // Возвращает элемент по случайному индексу
}

        export async function generateBooks(count = 10) { // Экспортируемая асинхронная функция (по умолчанию 10 книг)
for (let attempt = 0; attempt < 5; attempt++) { // Цикл с 5 попытками загрузки
        const subject = randomItem(SUBJECTS);   // Получаем случайный жанр
        const url = `https://openlibrary.org/subjects/${subject}.json?limit=50`; // Формируем URL запроса к API

        const response = await fetch(url);      // Выполняем HTTP-запрос и ждём ответ
        if (!response.ok) continue;             // Если ответ неуспешный, переходим к следующей попытке

        const data = await response.json();      // Преобразуем ответ в JSON-объект
        if (!data.works || !Array.isArray(data.works)) continue; // Проверяем наличие массива книг

        const books = data.works                 // Обрабатываем массив книг
            .filter(b => b.title && b.authors?.length) // Оставляем только книги с названием и автором
            .slice(0, count)                      // Берём нужное количество книг (не больше count)
            .map(book => ({                        // Преобразуем каждую книгу в нужный формат
                id: crypto.randomUUID(),            // Генерируем уникальный ID
                title: book.title,                  // Копируем название
                author: book.authors.map(a => a.name).join(", "), // Объединяем авторов через запятую
                genre: subject,                      // Присваиваем жанр (из запроса)
                year: book.first_publish_year ?? null, // Год издания или null
                rating: +(Math.random() * 2 + 3).toFixed(1) // Случайный рейтинг 3.0-5.0 с одним знаком
        }));
    
    if (books.length > 0 ) {               // Если удалось получить хотя бы одну книгу
        return books;                       // Возвращаем массив книг и завершаем функцию
    }
}
    throw new Error('Не удалось сгенерировать книги'); // После 5 попыток выбрасываем ошибку
}
