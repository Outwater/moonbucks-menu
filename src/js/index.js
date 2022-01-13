function App() {
  const $ = (selector) => document.querySelector(selector);
  const getCurrentMenuList = (category) => [
    `${category}MenuList`,
    this.state[`${category}MenuList`],
  ];
  const MENU_TITLE = {
    espresso: "☕ 에스프레소",
    frappuccino: "🥤 프라푸치노",
    blended: "🍹 블렌디드",
    teavana: "🫖 티바나",
    desert: "🍰 디저트",
  };

  this.init = () => {
    this.setState(JSON.parse(localStorage.getItem("menuList")));
    this.render();
  };

  this.state = {
    selectedCategory: "espresso",
    espressoMenuList: [],
    frappuccinoMenuList: [],
    blendedMenuList: [],
    teavanaMenuList: [],
    desertMenuList: [],
    //menu: {id:1, name:킹에스프레소, isSoldOut: true}
  };

  this.setState = async (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.render();
  };

  this.render = () => {
    this.renderList();
    this.renderHeader();
    this.mounted();
  };

  this.mounted = () => {
    localStorage.setItem("menuList", JSON.stringify(this.state));
  };

  //* 상태변경 Methods
  this.addMenu = (name) => {
    const [currentMenuKey, currentMenuList] = getCurrentMenuList(
      this.state.selectedCategory
    );
    const menu = {
      id: Math.max(...currentMenuList.map((v) => v.id), 0) + 1,
      name,
    };
    this.setState({ [currentMenuKey]: [...currentMenuList, menu] });
  };

  this.editMenu = (id, name) => {
    const [currentMenuKey, currentMenuList] = getCurrentMenuList(
      this.state.selectedCategory
    );
    this.setState({
      [currentMenuKey]: currentMenuList.map((menu) => {
        return menu.id === id ? { id, name } : menu;
      }),
    });
  };

  this.removeMenu = (id) => {
    const [currentMenuKey, currentMenuList] = getCurrentMenuList(
      this.state.selectedCategory
    );
    this.setState({
      [currentMenuKey]: currentMenuList.filter((menu) => menu.id !== id),
    });
  };

  //* View
  this.renderHeader = () => {
    const [_, currentMenuList] = getCurrentMenuList(
      this.state.selectedCategory
    );

    $(".heading > h2").textContent = `${
      MENU_TITLE[this.state.selectedCategory]
    } 메뉴관리`;
    $(".menu-count").innerHTML = `총 ${currentMenuList.length}개`;
  };

  this.renderList = () => {
    const [_, currentMenuList] = getCurrentMenuList(
      this.state.selectedCategory
    );

    const menuItemTemplate = (currentMenuList) => `
        <li class="menu-list-item d-flex items-center py-2" data-id="${currentMenuList.id}">
          <span class="w-100 pl-2 menu-name">${currentMenuList.name}</span>
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
  const handleAddMenu = () => {
    const $input = $("#menu-name");
    if ($input.value === "") return;
    this.addMenu($input.value);
    $input.value = "";
  };
  const handleEditMenu = (id) => {
    const [_, currentMenuList] = getCurrentMenuList(
      this.state.selectedCategory
    );
    const menuName = currentMenuList.filter((m) => m.id === id)[0].name;
    const editedMenuName = prompt("수정 할 메뉴이름은 무엇인가요?", menuName);

    if (!editedMenuName) return;
    this.editMenu(id, editedMenuName);
  };
  const handleRemoveMenu = (id) => {
    confirm(`정말 ${id}번 메뉴를 삭제하시겠습니까?`) && this.removeMenu(id);
  };
  const handleChangeMenu = (category) => {
    this.setState({ selectedCategory: category });
  };

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#menu-name").addEventListener("keyup", ({ key }) => {
    if (key !== "Enter") return;
    handleAddMenu();
  });

  $("#menu-submit-button").addEventListener("click", handleAddMenu);

  $("#menu-list").addEventListener("click", ({ target }) => {
    const id = Number(target.closest("[data-id]").dataset.id);

    if (target.classList.contains("menu-edit-button")) {
      handleEditMenu(id);
    } else if (target.classList.contains("menu-remove-button")) {
      handleRemoveMenu(id);
    }
  });

  $("header > nav").addEventListener("click", ({ target }) => {
    const category = target.dataset.categoryName;
    handleChangeMenu(category);
  });
  this.init();
}
new App();
