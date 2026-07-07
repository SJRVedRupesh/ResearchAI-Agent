const cache = new Map();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getCachedReport = (company) => {

    const key = company.toLowerCase().trim();

    const cachedData = cache.get(key);

    if (!cachedData) {
        return null;
    }

    const isExpired =
        Date.now() - cachedData.timestamp > CACHE_DURATION;

    if (isExpired) {

        cache.delete(key);

        return null;

    }

    return cachedData.data;

};

const saveReport = (company, report) => {

    const key = company.toLowerCase().trim();

    cache.set(key, {

        data: report,

        timestamp: Date.now()

    });

};

module.exports = {

    getCachedReport,

    saveReport

};