import { $ } from "../utils/dom.js";
const BASE_URL = "http://localhost:3000/api";

function App() {
  //* Core
  this.init = () => {
    this.setState({ category: "espresso" });
    setEvent();
  };

  this.state = {
    category: "espresso",
  };

  this.setState = async (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.render();
  };

  this.render = async () => {
    // 현재 선택된 리스트를 불러와서 해당 부분 렌더링
    const currentMenuList = await fetch(
      `${BASE_URL}/category/${this.state.category}/menu`
    ).then((res) => res.json());
    console.log("render실행");

    this.renderHeader(currentMenuList);
    this.renderList(currentMenuList);
    this.mounted();
  };

  this.mounted = () => {};

  //* View
  this.renderHeader = (currentMenuList) => {
    const category = this.state.category;
    $(".heading > h2").textContent = `${
      $(`[data-category-name='${category}']`).textContent
    } 메뉴관리`;
    $(".menu-count").innerHTML = `총 ${currentMenuList.length}개`;
  };

  this.renderList = (currentMenuList) => {
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
    const data = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    console.log("추가된 data: ", data);
    data && this.render();
  };
  const handleEditMenu = async (id) => {
    const category = this.state.category;
    const menuName = "기존이름";
    const editedMenuName = prompt("수정 할 메뉴이름은 무엇인가요?", menuName);

    if (!editedMenuName) return;
    const data = await fetch(`${BASE_URL}/category/${category}/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editedMenuName }),
    }).then((res) => res.json());
    console.log("수정된 data: ", data);
    data && this.render();
  };
  const handleRemoveMenu = async (id) => {
    if (!confirm(`정말 ${id}번 메뉴를 삭제하시겠습니까?`)) return;

    const category = this.state.category;
    const data = await fetch(`${BASE_URL}/category/${category}/menu/${id}`, {
      method: "DELETE",
    });
    data && this.render();
  };

  const handleClickSoldout = async (id) => {
    const category = this.state.category;
    const data = await fetch(
      `${BASE_URL}/category/${category}/menu/${id}/soldout`,
      {
        method: "PUT",
      }
    ).then((res) => res.json());
    console.log("품절처리한 data: ", data);
    data && this.render();
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
