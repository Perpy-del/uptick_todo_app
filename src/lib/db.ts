export function createTodoCollection () {
    if (!indexedDB) {
      console.log("IndexedDB could not be found in this browser.");
      return;
    }
    
    const request = indexedDB.open("TODODatabase", 2);

    request.onerror = (event) => {
        console.log("Error: ", event);
        console.log("An error occurred with IndexedDB")
    };
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("todoList")) {
        db.createObjectStore('todoList', {
            keyPath: "id",
            autoIncrement: true
        })
      }
    };

    request.onsuccess = () => {
        console.log("Database opened successfully");
    }
}
