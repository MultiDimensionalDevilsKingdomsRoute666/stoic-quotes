// Files in /public are served with `max-age=0, must-revalidate` by default, so
// browsers re-request them on every visit. Let browsers keep them for a while.
const ONE_WEEK = 60 * 60 * 24 * 7;

module.exports = {
  async headers() {
    return [
      {
        source: "/:file(favicon\\.ico|marcus-aurelius\\.jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_WEEK}, stale-while-revalidate=${ONE_WEEK}`,
          },
        ],
      },
    ];
  },
};
