import { $ } from "../utils/dom.js";
function App() {
  //* Core
  this.init = () => {
    this.setState(JSON.parse(localStorage.getItem("menuList")));
    this.setState({ category: "espresso" });
    setEvent();
    this.render();
  };

  this.state = {
    category: "espresso",
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
    //menu: {id:1, name:킹에스프레소, isSoldOut: true}
  };

  this.setState = async (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.render();
  };

  this.render = () => {
    this.renderHeader();
    this.renderList();
    this.mounted();
  };

  this.mounted = () => {
    localStorage.setItem("menuList", JSON.stringify(this.state));
  };

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
  const handleAddMenu = (name) => {
    const category = this.state.category;
    const currentMenuList = this.state[category];

    const menu = {
      id: Math.max(...currentMenuList.map((v) => v.id), 0) + 1,
      name,
      isSoldOut: false,
    };
    this.setState({ [category]: [...currentMenuList, menu] });
  };
  const handleEditMenu = (id) => {
    const category = this.state.category;
    const menuList = [...this.state[category]];

    const menuName = menuList.filter((m) => m.id === id)[0].name;
    const editedMenuName = prompt("수정 할 메뉴이름은 무엇인가요?", menuName);

    if (!editedMenuName) return;
    const editIdx = menuList.findIndex((item) => item.id === id);
    menuList[editIdx].name = editedMenuName;

    this.setState({ [category]: menuList });
  };
  const handleRemoveMenu = (id) => {
    if (!confirm(`정말 ${id}번 메뉴를 삭제하시겠습니까?`)) return;

    const category = this.state.category;
    const currentMenuList = this.state[category];

    this.setState({
      [category]: currentMenuList.filter((menu) => menu.id !== id),
    });
  };
  const handleClickSoldout = (id) => {
    const category = this.state.category;
    const menuList = [...this.state[category]];
    const index = menuList.findIndex((menu) => menu.id === id);

    menuList[index].isSoldOut = !menuList[index].isSoldOut;
    this.setState({ [category]: menuList });
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
      const id = Number(target.closest("[data-id]").dataset.id);

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
