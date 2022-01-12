function App() {
  const $ul = document.getElementById("espresso-menu-list");
  /*
  menu: {id:1, name:킹에스프레소}
  */
  this.state = {
    menus: [{ id: 1, name: "킹에스프레소" }],
  };

  this.setState = (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.renderList();
    this.renderCount();
  };

  //* 상태변경 Methods
  this.addMenu = (name) => {
    const { menus } = this.state;
    const menu = { id: Math.max(...menus.map((v) => v.id)) + 1, name };
    this.setState({ menus: [...menus, menu] });
  };

  this.editMenu = (id, name) => {
    const { menus } = this.state;
    this.setState({
      menus: menus.map((menu) => {
        return menu.id === id ? { id, name } : menu;
      }),
    });
  };

  this.removeMenu = (id) => {
    const { menus } = this.state;
    this.setState({
      menus: menus.filter((menu) => menu.id !== id),
    });
  };

  //* View
  this.renderList = () => {
    const { menus } = this.state;
    $ul.innerHTML = `${menus
      .map(
        (m) => `
        <li class="menu-list-item d-flex items-center py-2" data-id="${m.id}">
          <span class="w-100 pl-2 menu-name">${m.name}</span>
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
        `
      )
      .join("")}`;
  };

  this.renderCount = () => {
    const { menus } = this.state;
    const $count = document.querySelector(".menu-count");
    $count.innerHTML = `총 ${menus.length}개`;
  };

  //* Event처리
  document
    .getElementById("espresso-menu-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    });
  document
    .getElementById("espresso-menu-name")
    .addEventListener("keyup", ({ key, target }) => {
      if (key === "Enter") {
        if (target.value === "") return;
        this.addMenu(target.value);
        target.value = "";
      }
    });
  document
    .getElementById("espresso-menu-submit-button")
    .addEventListener("click", () => {
      const $input = document.getElementById("espresso-menu-name");
      if ($input.value === "") return;
      this.addMenu($input.value);
      $input.value = "";
    });

  //* 수정 삭제 이벤트 (이벤트위임 by 버블링)
  document
    .getElementById("espresso-menu-list")
    .addEventListener("click", ({ target }) => {
      const id = Number(target.closest("[data-id]").dataset.id);
      if (target.classList.contains("menu-edit-button")) {
        const editName = prompt("수정 할 메뉴이름은 무엇인가요?");
        this.editMenu(id, editName);
      } else if (target.classList.contains("menu-remove-button")) {
        confirm(`정말 ${id}번 메뉴를 삭제하시겠습니까?`) && this.removeMenu(id);
      }
    });
}
new App();
