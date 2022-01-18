import { $ } from "../utils/dom.js";
const BASE_URL = "http://localhost:3000/api";

function App() {
  const MenuApi = {
    async getAllMenuByCategory(category) {
      console.log("here");
      const currentMenuList = await fetch(
        `${BASE_URL}/category/${category}/menu`
      ).then((res) => res.json());
      return currentMenuList;
    },
    async addMenu(name, category) {
      const data = await fetch(`${BASE_URL}/category/${category}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }).then((res) => res.json());
      console.log("추가된 menu:", data);
    },
    async editMenu(category, id, name) {
      const data = await fetch(`${BASE_URL}/category/${category}/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }).then((res) => res.json());
      console.log("수정된 data: ", data);
    },
    async toggleSoldoutMenu(category, id) {
      const data = await fetch(
        `${BASE_URL}/category/${category}/menu/${id}/soldout`,
        { method: "PUT" }
      );
      console.log("품절처리한 data: ", data.json());
    },
    async deleteMenu(category, id) {
      const data = await fetch(`${BASE_URL}/category/${category}/menu/${id}`, {
        method: "DELETE",
      });
      console.log("삭제된 data:", data);
    },
  };
  //* Core
  this.init = async () => {
    this.setState({ category: "espresso" });
    const currentMenuList = await MenuApi.getAllMenuByCategory(
      this.state.category
    );
    this.setState({ [this.state.category]: currentMenuList });
    setEvent();
  };

  this.state = {
    category: "espresso",
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.setState = async (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.render();
  };

  this.render = async () => {
    // 현재 선택된 리스트를 불러와서 해당 부분 렌더링
    this.renderHeader();
    this.renderList();
    this.mounted();
  };

  this.mounted = () => {};

  //* View
  this.renderHeader = () => {
    const category = this.state.category;
    const currentMenuList = this.state[category];
    $(".heading > h2").textContent = `${
      $(`[data-category-name='${category}']`).textContent
    } 메뉴관리`;
    $(".menu-count").innerHTML = `총 ${currentMenuList.length}개`;
  };

  this.renderList = () => {
    const category = this.state.category;
    const currentMenuList = this.state[category];
    const menuItemTemplate = (currentMenu) => `
        <li class="menu-list-item d-flex items-center py-2"
          data-id="${currentMenu.id}">
          <span class="w-100 pl-2 menu-name ${
            currentMenu.isSoldOut ? "sold-out" : null
          }">${currentMenu.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>
    `;
    $("#menu-list").innerHTML = `
      ${currentMenuList.map((menu) => menuItemTemplate(menu)).join("")}
      `;
  };

  //* Event처리
  const handleAddMenu = async (name) => {
    const category = this.state.category;
    await MenuApi.addMenu(name, category);
    const currentMenuList = await MenuApi.getAllMenuByCategory(category);
    this.setState({ [category]: currentMenuList });
  };
  const handleEditMenu = async (id) => {
    const category = this.state.category;
    const menuName = this.state[category].find((menu) => menu.id === id).name;
    const editedMenuName = prompt("수정 할 메뉴이름은 무엇인가요?", menuName);

    if (!editedMenuName) return;
    await MenuApi.editMenu(category, id, editedMenuName);
    const currentMenuList = await MenuApi.getAllMenuByCategory(category);
    this.setState({ [category]: currentMenuList });
  };
  const handleRemoveMenu = async (id) => {
    if (!confirm(`정말 ${id}번 메뉴를 삭제하시겠습니까?`)) return;

    const category = this.state.category;
    await MenuApi.deleteMenu(category, id);

    const currentMenuList = await MenuApi.getAllMenuByCategory(category);
    this.setState({ [category]: currentMenuList });
  };

  const handleClickSoldout = async (id) => {
    const category = this.state.category;
    await MenuApi.toggleSoldoutMenu(category, id);

    const currentMenuList = await MenuApi.getAllMenuByCategory(category);
    this.setState({ [category]: currentMenuList });
  };

  const handleChangeCategory = (category) => {
    this.setState({ category });
  };

  const setEvent = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-name").addEventListener("keyup", ({ key }) => {
      if (key !== "Enter") return;
      const $input = $("#menu-name");
      if ($input.value === "") return;
      handleAddMenu($input.value);
      $input.value = "";
    });

    $("#menu-submit-button").addEventListener("click", () => {
      const $input = $("#menu-name");
      if ($input.value === "") return;
      handleAddMenu($input.value);
      $input.value = "";
    });

    $("#menu-list").addEventListener("click", ({ target }) => {
      const id = target.closest("[data-id]").dataset.id;

      if (target.classList.contains("menu-edit-button")) {
        handleEditMenu(id);
        return;
      }

      if (target.classList.contains("menu-remove-button")) {
        handleRemoveMenu(id);
        return;
      }

      if (target.classList.contains("menu-sold-out-button")) {
        handleClickSoldout(id);
        return;
      }
    });

    $("header > nav").addEventListener("click", ({ target }) => {
      if (!target.classList.contains("cafe-category-name")) return;
      const category = target.dataset.categoryName;
      handleChangeCategory(category);
    });
  };
}
const app = new App();

app.init();
