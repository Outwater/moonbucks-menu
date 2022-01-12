/*
- Todo1. 메뉴 추가 <br>

  - 메뉴의 이름을 입력 받고, 확인 버튼을 누르면 메뉴가 추가된다.
  - 메뉴의 이름을 입력 받고, 엔터키 입력하면 메뉴가 추가돤다.
  - 메뉴가 추가되고 나면, input은 빈 값이 된다.
  - 사용자 입력이 빈 값이라면, 메뉴는 추가되지 않는다.

  - 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
  - 추가 시 변경된 메뉴 개수를 상단에 보여준다.

*/

function App() {
  const $ul = document.getElementById("espresso-menu-list");

  this.state = {
    menus: [],
  };

  this.setState = (newState) => {
    this.state = { ...this.state, ...newState };
    console.log("state변경:", this.state);
    this.renderList();
    this.renderCount();
  };

  this.addMenu = (menu) => {
    const { menus } = this.state;
    this.setState({ menus: [...menus, menu] });
  };

  //* View
  this.renderList = () => {
    const { menus } = this.state;
    $ul.innerHTML = `${menus
      .map(
        (v) => `<li class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${v}</span>
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
  </li>`
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
}
new App();
