const BASE_URL = "http://localhost:3000/api";
const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return { method: "DELETE" };
  },
};

const request = async (url, option) => {
  const response = await fetch(url, option);

  if (!response.ok) {
    console.error(response);
    const err = await response.json();
    return err && alert(err.message);
  }
  return await response.json();
};

const requestWithoutJSON = async (url, option) => {
  const response = await fetch(url, option);

  if (!response.ok) {
    console.error(response);
    const err = await response.json();
    return err && alert(err.message);
  }
  return await response;
};

export const MenuApi = {
  async getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  async addMenu(name, category) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },
  async editMenu(category, id, name) {
    return request(
      `${BASE_URL}/category/${category}/menu/${id}`,
      HTTP_METHOD.PUT({ name })
    );
  },
  async toggleSoldoutMenu(category, id) {
    return request(
      `${BASE_URL}/category/${category}/menu/${id}/soldout`,
      HTTP_METHOD.PUT()
    );
  },
  async deleteMenu(category, id) {
    return requestWithoutJSON(
      `${BASE_URL}/category/${category}/menu/${id}`,
      HTTP_METHOD.DELETE()
    );
  },
};
