function App() {
  const $ = (selector) => document.querySelector(selector);

  this.init = () => {
    this.renderCount();
    this.renderList();
  };

  this.state = {
    espressoMenuList: [],
    //menu: {id:1, name:킹에스프레소}
  };

  this.setState = (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.renderList();
    this.renderCount();
  };

  //* 상태변경 Methods
  this.addMenu = (name) => {
    const { espressoMenuList } = this.state;
    const menu = {
      id: Math.max(...espressoMenuList.map((v) => v.id), 0) + 1,
      name,
    };
    this.setState({ espressoMenuList: [...espressoMenuList, menu] });
  };

  this.editMenu = (id, name) => {
    const { espressoMenuList } = this.state;
    this.setState({
      espressoMenuList: espressoMenuList.map((menu) => {
        return menu.id === id ? { id, name } : menu;
      }),
    });
  };

  this.removeMenu = (id) => {
    const { espressoMenuList } = this.state;
    this.setState({
      espressoMenuList: espressoMenuList.filter((menu) => menu.id !== id),
    });
  };

  //* View
  this.renderList = () => {
    const { espressoMenuList } = this.state;
    const menuItemTemplate = (espressoMenu) => `
        <li class="menu-list-item d-flex items-center py-2" data-id="${espressoMenu.id}">
          <span class="w-100 pl-2 menu-name">${espressoMenu.name}</span>
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
    $("#espresso-menu-list").innerHTML = `
      ${espressoMenuList.map((menu) => menuItemTemplate(menu)).join("")}
      `;
  };

  this.renderCount = () => {
    const { espressoMenuList } = this.state;
    $(".menu-count").innerHTML = `총 ${espressoMenuList.length}개`;
  };

  //* Event처리
  const handleAddMenu = () => {
    const $input = $("#espresso-menu-name");
    if ($input.value === "") return;
    this.addMenu($input.value);
    $input.value = "";
  };
  const handleEditMenu = (id) => {
    const menuName = this.state.espressoMenuList.filter((m) => m.id === id)[0]
      .name;
    const editedMenuName = prompt("수정 할 메뉴이름은 무엇인가요?", menuName);

    if (!editedMenuName) return;
    this.editMenu(id, editedMenuName);
  };
  const handleRemoveMenu = (id) => {
    confirm(`정말 ${id}번 메뉴를 삭제하시겠습니까?`) && this.removeMenu(id);
  };

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-name").addEventListener("keyup", ({ key }) => {
    if (key !== "Enter") return;
    handleAddMenu();
  });

  $("#espresso-menu-submit-button").addEventListener("click", handleAddMenu);

  $("#espresso-menu-list").addEventListener("click", ({ target }) => {
    const id = Number(target.closest("[data-id]").dataset.id);

    if (target.classList.contains("menu-edit-button")) {
      handleEditMenu(id);
    } else if (target.classList.contains("menu-remove-button")) {
      handleRemoveMenu(id);
    }
  });

  this.init();
}
new App();
