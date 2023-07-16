// Функция для определения свободного времени доктора
function findFreeTime(busy, workStartTime, workEndTime) {
    // Преобразуем время начала и окончания работы в минуты относительно полуночи
    const [workStartHour, workStartMinute] = workStartTime.split(':').map(Number);
    const [workEndHour, workEndMinute] = workEndTime.split(':').map(Number);
    const workStartMinutes = workStartHour * 60 + workStartMinute;
    const workEndMinutes = workEndHour * 60 + workEndMinute;

    // Создаем массив с временными метками для начала и окончания работы
    const timeSlots = [{ start: 0, stop: workStartMinutes }, { start: workEndMinutes, stop: 24 * 60 }];

    // Добавляем временные метки для занятых интервалов
    busy.forEach(({ start, stop }) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [stopHour, stopMinute] = stop.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const stopMinutes = stopHour * 60 + stopMinute;

        timeSlots.push({ start: startMinutes, stop: stopMinutes });
    });

    // Сортируем временные метки по времени начала
    timeSlots.sort((a, b) => a.start - b.start);

    // Находим свободные интервалы
    const freeTimeSlots = [];
    for (let i = 1; i < timeSlots.length; i++) {
        const previousSlot = timeSlots[i - 1];
        const currentSlot = timeSlots[i];
        if (previousSlot.stop < currentSlot.start) {
            const diffMinutes = currentSlot.start - previousSlot.stop;
            if (diffMinutes >= 30) {
                // Разделяем свободное время на интервалы по 30 минут
                let start = previousSlot.stop;
                while (start + 30 <= currentSlot.start) {
                    const stop = start + 30;
                    freeTimeSlots.push({ start: minutesToTime(start), stop: minutesToTime(stop) });
                    start = stop;
                }
            }
        }
    }

    return freeTimeSlots;
}

// Вспомогательная функция для преобразования минут относительно полуночи в формат 'hh:mm'
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Время работы доктора
const workStartTime = '09:00';
const workEndTime = '21:00';

// Время, когда доктор занят
const busy = [
    { start: '10:30', stop: '10:50' },
    { start: '18:40', stop: '18:50' },
    { start: '14:40', stop: '15:50' },
    { start: '16:40', stop: '17:20' },
    { start: '20:05', stop: '20:20' },
];

// Находим свободное время с интервалами по 30 минут
const freeTime = findFreeTime(busy, workStartTime, workEndTime);
console.log(freeTime);

freeTime.map( el => {
    const container = document.querySelector("#container")
    container.innerHTML += (`<p> ${el.start} - ${el.stop} </p> `)
})