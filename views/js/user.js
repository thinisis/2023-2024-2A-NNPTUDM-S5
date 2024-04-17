const InfoE = document.getElementById("infomation");
const HistoryE = document.getElementById("history");
const UpdateInfoE = document.getElementById("update-info");
const ChangePasswordE = document.getElementById("change-password");
const InfoOffset = InfoE.offsetTop;
const HistoryOffset = HistoryE.offsetTop;
const UpdateInfoOffset = UpdateInfoE.offsetTop;
const ChangePasswordOffset = ChangePasswordE.offsetTop;
const hrefInfoE = document.querySelector("a[href='#infomation']");
const hrefHistoryE = document.querySelector("a[href='#history']");
const hrefUpdateE = document.querySelector("a[href='#update-info']");
const hrefChangeE = document.querySelector("a[href='#change-password']");
console.log(InfoOffset, HistoryOffset, ChangePasswordOffset, UpdateInfoOffset);
const checkElementInViewPort = (element) => {
  return (
    element.getBoundingClientRect().y <= 0 &&
    element.getBoundingClientRect().y + element.getBoundingClientRect().height >
      0
  );
};
const toggleActive = (element, hrefE) => {
  if (checkElementInViewPort(element)) {
    if (!hrefE.classList.contains("active")) {
      hrefE.classList.add("active");
    }
  } else {
    if (hrefE.classList.contains("active")) {
      hrefE.classList.remove("active");
    }
  }
};
document.addEventListener("scroll", () => {
  toggleActive(InfoE, hrefInfoE);
  toggleActive(HistoryE, hrefHistoryE);
  toggleActive(UpdateInfoE, hrefUpdateE);
  toggleActive(ChangePasswordE, hrefChangeE);
});
