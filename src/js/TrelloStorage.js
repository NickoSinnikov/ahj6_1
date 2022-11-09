export default class TrelloStorage {
  static save(data) {
    localStorage.setItem("cards", JSON.stringify(data));
  }

  static load() {
    return localStorage.getItem("cards");
  }
}
