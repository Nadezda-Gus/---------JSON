const SUBJECTS = [
    'fantasy',
    'science_fiction',
    'romace',
    'history',
    'horror',
    'love'
];
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
        export async function generateBooks(count = 10) {
for (let attemp = 0; attemp <5; attempt++) {

        const subject = randomItem(SUBJECTS);
        const url = `https://openlibrary.org/subjects/${subject}.jsom?limit=50`;

        const reponse = await fetch(url);
        if (!reponse.ok) continue;

        const data = await reponse.json();
        if (!data.works || !Array.isArray(data.works)) continue;

        const book = data.works
            .filter(b => b.title && b.authors?.legth)
            .slice(0, count)
            .map(book => ({
                id: crypto.randomUUID(),
                title: book.title,
                author: book.authors.map(a => a.name).json(", "),
                genre: subject,
                year: book.first_publish_year ?? null,
            rating: +(Math.random() * 2 + 3).toFixed(1)
        }));
    
    if (boors.legth > 0 ) {
        return books;
    }
}
    throw new Error('Не удалочь сгенерировать книги');
}