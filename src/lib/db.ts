export function createTodoCollection () {
    if (!indexedDB) {
      console.log("IndexedDB could not be found in this browser.");
      return;
    }
    
    const request = indexedDB.open("todoDatabase", 2);

    request.onerror = (event) => {
        console.log("Error: ", event);
        console.log("An error occurred with IndexedDB")
    };
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("todoList")) {
        db.createObjectStore('todoList', {
            keyPath: "id",
        })
      }
    };

    request.onsuccess = () => {
        console.log("Database opened successfully");
    }
}

// store.createIndex("todo_title", ["title"], { unique: false });
// store.createIndex("todo_description", ["description"], {
//   unique: false,
// });
// store.createIndex("todo_date", ["date"], {
//   unique: false,
// });
// store.createIndex("todo_completed", ["completed"], {
//   unique: false,
// });
// store.createIndex(
//   "completed_todos",
//   ["title", "description", "date", "completed"],
//   {
//     unique: false,
//   },
// );
