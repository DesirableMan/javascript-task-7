'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    return new Promise((resolve) => {
        if (!jobs.length) {
            return resolve([]);
        }

        let counter = 0;
        let result = [];

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            run(counter++);
        }

        function run(index) {
            const handler = (item) => {
                result[index] = item;

                if (result.length === jobs.length) {
                    return resolve(result);
                }
                if (counter < jobs.length) {
                    run(counter++);
                }
            };

            Promise.race([
                jobs[index](),
                new Promise((_, reject) =>
                    setTimeout(reject, timeout, new Error('Promise timeout'))
                )
            ]).then(handler, handler);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
