export const fetchHelper = async (url: string, options: RequestInit = {}) => fetch(url, options)
  .then(async (res) => ({
    res,
    data: await res.json()
  }))
  .catch(err => {
    console.error(err);
    return {
      res: null,
      data: null
    };
  })
