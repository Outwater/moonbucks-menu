import { $ } from "../utils/dom.js";
import { MenuApi } from "./api/index.js";
function App() {
  //* Core
  this.init = async () => {
    const defaultCategory = "espresso";
    const currentMenuList = await MenuApi.getAllMenuByCategory(defaultCategory);
    this.setState({
      category: defaultCategory,
      [defaultCategory]: currentMenuList,
    });
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
  const handleAddMenu = async () => {
    const name = $("#menu-name").value;
    if (!name) return;

    const category = this.state.category;
    const duplicatedItem = this.state[category].find(
      (menu) => menu.name === name
    );

    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }
    await MenuApi.addMenu(name, category);
    this.setState({ [category]: await MenuApi.getAllMenuByCategory(category) });

    $("#menu-name").value = "";
  };
  const handleEditMenu = async (id) => {
    const category = this.state.category;
    const menuName = this.state[category].find((menu) => menu.id === id).name;
    const editedMenuName = prompt("수정 할 메뉴이름은 무엇인가요?", menuName);
    if (!editedMenuName) return;

    const duplicatedItem = this.state[category].find(
      (menu) => menu.name === editedMenuName
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      return;
    }

    await MenuApi.editMenu(category, id, editedMenuName);

    this.setState({ [category]: await MenuApi.getAllMenuByCategory(category) });
  };
  const handleRemoveMenu = async (id) => {
    const menuName = this.state[this.state.category].find(
      (menu) => menu.id === id
    ).name;
    if (!confirm(`정말 ${menuName}를 삭제하시겠습니까?`)) return;

    const category = this.state.category;
    await MenuApi.deleteMenu(category, id);
    this.setState({ [category]: await MenuApi.getAllMenuByCategory(category) });
  };

  const handleClickSoldout = async (id) => {
    const category = this.state.category;
    await MenuApi.toggleSoldoutMenu(category, id);

    this.setState({ [category]: await MenuApi.getAllMenuByCategory(category) });
  };

  const handleChangeCategory = async (category) => {
    this.setState({
      category,
      [category]: await MenuApi.getAllMenuByCategory(category),
    });
  };

  const setEvent = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-name").addEventListener("keyup", ({ key }) => {
      if (key !== "Enter") return;
      handleAddMenu();
    });

    $("#menu-submit-button").addEventListener("click", handleAddMenu);

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
